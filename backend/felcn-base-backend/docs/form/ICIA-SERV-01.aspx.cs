using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Text;
using System.Web.Security;
using GMapGeocoder;
using Subgurim.Controles;
using System.Reflection.Emit;

public partial class Forms_ICIA_SERV_01 : System.Web.UI.Page
{
    string usuariolog = HttpContext.Current.User.Identity.Name;
    DateTime ahora = DateTime.Now;
    protected void Page_Init()
    {
        txtpase.Text = Servicio.Numeropase(HttpContext.Current.User.Identity.Name);
        if (Servicio.Verificaservicio(txtpase.Text.Trim()) == "SI")
        {
            txtcodserv.Text = Servicio.Muestraservicio(txtpase.Text.Trim());
            Txtfechaop.Text = ahora.ToString();
        }
        else if (Servicio.Verificaemergencia(txtpase.Text.Trim()) == "SI")
        {
            txtcodserv.Text = Servicio.Muestraemergencia(txtpase.Text.Trim());
            Txtfechaop.Text = ahora.ToString();
        }
        else
        {
            Response.Redirect("~/Forms/Default3.aspx");
        }
    }
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            if (Formularios.Verificar(usuariolog.Trim(), "ICIA-SERV-01.aspx") == "SI")
            {
                Cbodpto();
                CboUnid();
                MuestraOperativos(txtcodserv.Text.Trim());
            }
            else
            {
                Response.Redirect("~/Forms/Default3.aspx");
            }
        }        
    }
    private void Cbodpto()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXASIG);
        SqlConn.Open();
        string sql = "SELECT DptoAv_Id, Descripcion FROM DEPARTAMENTOS";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        ddldpto.ClearSelection();
        ddldpto.Items.Clear();
        ddldpto.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            ddldpto.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }

    private void CboUnid()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Uni_Abrev, Uni_Descripcion FROM UNIDADES";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbounidad.ClearSelection();
        cbounidad.Items.Clear();
        cbounidad.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbounidad.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void cbounidad_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT DISTRITALES.Dis_Id, DISTRITALES.Dis_Descripcion FROM DISTRITALES INNER JOIN UNIDADES ON DISTRITALES.Uni_Id = UNIDADES.Uni_Id WHERE (UNIDADES.Uni_Abrev = N'" + cbounidad.SelectedValue.Trim() + "')";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cboDistrital.ClearSelection();
        cboDistrital.Items.Clear();
        cboDistrital.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cboDistrital.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();

    }
    protected void cboDistrital_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Grp_Id, Descripcion FROM GRUPOS WHERE (Dis_Id =" + Convert.ToInt32(cboDistrital.SelectedValue) + ")";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cboGrupo.ClearSelection();
        cboGrupo.Items.Clear();
        cboGrupo.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cboGrupo.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void cboGrupo_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.connectionstring);
        SqlConn.Open();
        string sql = "SELECT Users.Usuario, RTRIM(Grados.Abrev) + ' ' + RTRIM(Users.NombreApp) AS solicitantes FROM Users INNER JOIN Grados ON Users.Gr_Id = Grados.Gr_Id WHERE (Users.Grp_Id = " + cboGrupo.SelectedValue.Trim() + ")";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        ddlsolicita.ClearSelection();
        ddlsolicita.Items.Clear();
        ddlsolicita.Items.Add("Seleccione un Dato");
        ddlasignado.ClearSelection();
        ddlasignado.Items.Clear();
        ddlasignado.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            ddlsolicita.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
            ddlasignado.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }    
    protected void ddlsolicita_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (ddlsolicita.SelectedItem.Text.Trim() != "Seleccione un Dato")
        {
            string numero = Servicio.Numerousuario(ddlsolicita.SelectedValue.Trim());
            fonosolicita.Text = numero.Trim();
        }
    }
    protected void ddlasignado_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (ddlasignado.SelectedItem.Text.Trim() != "Seleccione un Dato")
        {
            string numero = Servicio.Numerousuario(ddlasignado.SelectedValue.Trim());
            fonoasignado.Text = numero.Trim();
        }
    }    
    protected void Asigcaso_Click(object sender, EventArgs e)
    {
        Page.Validate("codigo");
        if (Page.IsValid)
        {
            nroregistro();            
        }        
    }    
    private void nroregistro()
    {
        String Var_Sub = DateTime.Now.ToString("yy");
        string strSQL = "SELECT COUNT(Casos_Id) AS Expr1 FROM ASIGNACION WHERE (DptoAv_Id = N'" + ddldpto.SelectedValue.ToString().Trim() + "') AND (Uni_Abrev = N'" + cbounidad.SelectedValue.Trim() + "') AND (NroOperativo like '%/" + Var_Sub.Trim() + "%')";
        DataTable dtv = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        SqlCommand cmd = new SqlCommand(strSQL);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        sd.Fill(dtv);
        int cuenta = Convert.ToInt32(dtv.Rows[0][0].ToString());
        for (int i = 0; i < dtv.Rows.Count; i++)
        {
            if (dtv.Rows[i][0].ToString() == "0")
            {
                txtnroreg.Text = ddldpto.SelectedValue.ToString().Trim() + "-" + cbounidad.SelectedValue.Trim() + "-1/" + DateTime.Now.ToString("yy");
            }
            else
            {
                cuenta = cuenta + 1;
                txtnroreg.Text = ddldpto.SelectedValue.ToString().Trim() + "-" + cbounidad.SelectedValue.Trim() + "-" + cuenta.ToString() + "/" + DateTime.Now.ToString("yy");
            }
        }
        SqlConn.Close();
    }
    protected void GuardarCasReg_Click(object sender, EventArgs e)
    {
        Page.Validate("guarda");
        if (Page.IsValid)
        {
            insertacasosS2();
            insertacasosS3();
            Response.Redirect("~/Forms/ICIA-SERV-01.aspx");
        }
    }
    private void insertacasosS2()
    {
        string ret = "";
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXASIG);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO ASIGNACION(DptoAv_Id, UnidAV_Id, Letras, NroCaso, NroOperativo, FechaOperativo, NombreCaso, AsigCaso, CodServicio, FiscalAsigCaso, fechahoraing, Usuario) VALUES (@DptoAv_Id, @UnidAV_Id, @Letras, @NroCaso, @NroOperativo, @FechaOperativo, @NombreCaso, @AsigCaso, @CodServicio, @FiscalAsigCaso, @fechahoraing, @Usuario) ;SELECT  Scope_Identity();";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter DptoAv_Id = new SqlParameter("@DptoAv_Id", SqlDbType.NChar, 2);
        DptoAv_Id.Value = ddldpto.SelectedValue.ToString().Trim();
        cmd.Parameters.Add(DptoAv_Id);
        SqlParameter UnidAV_Id = new SqlParameter("@UnidAV_Id", SqlDbType.NChar, 2);
        UnidAV_Id.Value = Servicio.CodigoUnidad(cbounidad.SelectedValue.ToString());
        cmd.Parameters.Add(UnidAV_Id);
        SqlParameter Letras = new SqlParameter("@Letras", SqlDbType.NChar, 3);
        Letras.Value = "PD";
        cmd.Parameters.Add(Letras);
        SqlParameter NroCaso = new SqlParameter("@NroCaso", SqlDbType.NChar, 20);
        NroCaso.Value = "";
        cmd.Parameters.Add(NroCaso);
        SqlParameter NroOperativo = new SqlParameter("@NroOperativo", SqlDbType.NChar, 20);
        NroOperativo.Value = txtnroreg.Text.Trim().ToUpper();
        cmd.Parameters.Add(NroOperativo);
        SqlParameter FechaOperativo = new SqlParameter("FechaOperativo", SqlDbType.DateTime);
        FechaOperativo.Value = Convert.ToDateTime(Txtfechaop.Text.Trim());
        cmd.Parameters.Add(FechaOperativo);
        if (Txtnombcaso.Text.Trim() == "")
        {
            SqlParameter NombreCaso = new SqlParameter("@NombreCaso", SqlDbType.NChar, 30);
            NombreCaso.Value = "*";
            cmd.Parameters.Add(NombreCaso);
        }
        else
        {
            SqlParameter NombreCaso = new SqlParameter("@NombreCaso", SqlDbType.NChar, 30);
            NombreCaso.Value = Txtnombcaso.Text.Trim().ToUpper();
            cmd.Parameters.Add(NombreCaso);
        }
        SqlParameter AsigCaso = new SqlParameter("@AsigCaso", SqlDbType.NChar, 70);
        AsigCaso.Value = ddlasignado.SelectedItem.ToString().Trim().ToUpper();
        cmd.Parameters.Add(AsigCaso);
        SqlParameter CodServicio = new SqlParameter("@CodServicio", SqlDbType.NVarChar, 50);
        CodServicio.Value = txtcodserv.Text.Trim().ToUpper();
        cmd.Parameters.Add(CodServicio);
        if (txtfiscalasignado.Text.Trim() == "")
        {
            SqlParameter FiscalAsigCaso = new SqlParameter("@FiscalAsigCaso", SqlDbType.NChar, 70);
            FiscalAsigCaso.Value = "*";
            cmd.Parameters.Add(FiscalAsigCaso);
        }
        else
        {
            SqlParameter FiscalAsigCaso = new SqlParameter("@FiscalAsigCaso", SqlDbType.NChar, 70);
            FiscalAsigCaso.Value = txtfiscalasignado.Text.Trim().ToUpper();
            cmd.Parameters.Add(FiscalAsigCaso);
        }
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = txtpase.Text.Trim();
        cmd.Parameters.Add(Usuario);
        con.Open();
        ret = cmd.ExecuteScalar().ToString();
        con.Close();
    }
    private void insertacasosS3()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO ASIGNACION(DptoAv_Id, Uni_Abrev, Dis_Id, Grp_Id, Letras, NroCaso, NroCasoPerDom, NroOperativo, CodServicio, IANUS, NombreCaso, FSolicitud, FonoS, AsigCaso, FonoA, FiscalAsigCaso, FonoF, Eta_Inv, Resultado, fechahoraing, Usuario) VALUES (@DptoAv_Id, @Uni_Abrev, @Dis_Id, @Grp_Id, @Letras, @NroCaso, @NroCasoPerDom, @NroOperativo, @CodServicio, @IANUS, @NombreCaso, @FSolicitud, @FonoS, @AsigCaso, @FonoA, @FiscalAsigCaso, @FonoF, @Eta_Inv, @Resultado, @fechahoraing, @Usuario)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter DptoAv_Id = new SqlParameter("@DptoAv_Id", SqlDbType.NChar, 2);
        DptoAv_Id.Value = ddldpto.SelectedValue.ToString().Trim();
        cmd.Parameters.Add(DptoAv_Id);
        SqlParameter Uni_Abrev = new SqlParameter("@Uni_Abrev", SqlDbType.NChar, 3);
        Uni_Abrev.Value = cbounidad.SelectedValue.ToString().Trim();
        cmd.Parameters.Add(Uni_Abrev);
        SqlParameter Dis_Id = new SqlParameter("@Dis_Id", SqlDbType.Int);
        Dis_Id.Value = Convert.ToInt32(cboDistrital.SelectedValue.Trim());
        cmd.Parameters.Add(Dis_Id);
        SqlParameter Grp_Id = new SqlParameter("@Grp_Id", SqlDbType.Int);
        Grp_Id.Value = Convert.ToInt32(cboGrupo.SelectedValue.Trim());
        cmd.Parameters.Add(Grp_Id);
        SqlParameter Letras = new SqlParameter("@Letras", SqlDbType.NChar, 3);
        Letras.Value = "";
        cmd.Parameters.Add(Letras);
        SqlParameter NroCaso = new SqlParameter("@NroCaso", SqlDbType.NChar, 20);
        NroCaso.Value = "";
        cmd.Parameters.Add(NroCaso);
        SqlParameter NroCasoPerDom = new SqlParameter("@NroCasoPerDom", SqlDbType.NChar, 20);
        NroCasoPerDom.Value = "";
        cmd.Parameters.Add(NroCasoPerDom);
        SqlParameter NroOperativo = new SqlParameter("@NroOperativo", SqlDbType.NChar, 20);
        NroOperativo.Value = txtnroreg.Text.Trim().ToUpper();
        cmd.Parameters.Add(NroOperativo);
        SqlParameter CodServicio = new SqlParameter("@CodServicio", SqlDbType.NVarChar, 50);
        CodServicio.Value = txtcodserv.Text.Trim().ToUpper();
        cmd.Parameters.Add(CodServicio);
        SqlParameter IANUS = new SqlParameter("@IANUS", SqlDbType.NChar, 20);
        IANUS.Value = "";
        cmd.Parameters.Add(IANUS);
        if (Txtnombcaso.Text.Trim() == "")
        {
            SqlParameter NombreCaso = new SqlParameter("@NombreCaso", SqlDbType.NChar, 30);
            NombreCaso.Value = "";
            cmd.Parameters.Add(NombreCaso);
        }
        else
        {
            SqlParameter NombreCaso = new SqlParameter("@NombreCaso", SqlDbType.NChar, 30);
            NombreCaso.Value = Txtnombcaso.Text.Trim().ToUpper();
            cmd.Parameters.Add(NombreCaso);
        }
        SqlParameter FSolicitud = new SqlParameter("@FSolicitud", SqlDbType.NVarChar, 100);
        FSolicitud.Value = ddlsolicita.SelectedItem.ToString().Trim().ToUpper();
        cmd.Parameters.Add(FSolicitud);
        SqlParameter FonoS = new SqlParameter("@FonoS", SqlDbType.NChar, 20);
        FonoS.Value = fonosolicita.Text.Trim().ToUpper();
        cmd.Parameters.Add(FonoS);
        SqlParameter AsigCaso = new SqlParameter("@AsigCaso", SqlDbType.NVarChar, 100);
        AsigCaso.Value = ddlasignado.SelectedItem.ToString().Trim().ToUpper();
        cmd.Parameters.Add(AsigCaso);
        SqlParameter FonoA = new SqlParameter("@FonoA", SqlDbType.NChar, 20);
        FonoA.Value = fonoasignado.Text.Trim().ToUpper();
        cmd.Parameters.Add(FonoA);
        SqlParameter FiscalAsigCaso = new SqlParameter("@FiscalAsigCaso", SqlDbType.NChar, 70);
        FiscalAsigCaso.Value = txtfiscalasignado.Text.Trim().ToUpper();
        cmd.Parameters.Add(FiscalAsigCaso);
        SqlParameter FonoF = new SqlParameter("@FonoF", SqlDbType.NChar, 20);
        FonoF.Value = fonofiscal.Text.Trim().ToUpper();
        cmd.Parameters.Add(FonoF);
        SqlParameter Eta_Inv = new SqlParameter("@Eta_Inv", SqlDbType.Int);
        Eta_Inv.Value = 7;
        cmd.Parameters.Add(Eta_Inv);        
        SqlParameter Resultado = new SqlParameter("@Resultado", SqlDbType.Int);
        Resultado.Value = Convert.ToInt32("1"); ;
        cmd.Parameters.Add(Resultado);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = ddlsolicita.SelectedValue.ToString().Trim().ToUpper();
        cmd.Parameters.Add(Usuario);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
    }
    private void MuestraOperativos(string codigo)
    {
        string ConsulCasos = "SELECT ASIGNACION.Casos_Id AS CO1, DEPARTAMENTOS.Descripcion AS CO2, UNIDADES.Uni_Descripcion AS CO3, ASIGNACION.NroOperativo AS CO4, ASIGNACION.FechaOperativo AS CO5, ASIGNACION.NombreCaso AS CO6, ASIGNACION.AsigCaso AS CO7, ASIGNACION.FiscalAsigCaso AS CO8 " + 
                             "FROM ASIGNACION INNER JOIN DEPARTAMENTOS ON ASIGNACION.DptoAv_Id = DEPARTAMENTOS.DptoAv_Id INNER JOIN UNIDADES ON ASIGNACION.UnidAV_Id = UNIDADES.UnidAV_Id " + 
                             "WHERE(ASIGNACION.CodServicio = N'" + codigo.Trim() + "') ORDER BY CO5";
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXASIG);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter(ConsulCasos.Trim(), con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        CuadroOperativos.DataSource = ds;
        CuadroOperativos.DataBind();
        con.Close();
    }
    protected void CuadroOperativos_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        string id = CuadroOperativos.Rows[e.RowIndex].Cells[0].Text;
        string nroop = CuadroOperativos.Rows[e.RowIndex].Cells[3].Text;
        deleteOperativos(id);
        deletesegcasos(nroop);
        MuestraOperativos(txtcodserv.Text.Trim());
    }
    private void deleteOperativos(string codigo)
    {
        string sql = "delete ASIGNACION where Casos_Id = " + codigo.Trim();
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXASIG);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
    }
    private void deletesegcasos(string nroop)
    {
        string sql = "delete ASIGNACION where (NroOperativo = '" + nroop.Trim() + "')";
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXSIII);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
    }
}