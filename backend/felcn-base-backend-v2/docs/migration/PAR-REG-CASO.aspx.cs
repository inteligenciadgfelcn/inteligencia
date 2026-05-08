using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Text;
using System.Web.Security;

public partial class FELCN_CASOS_PAR_REG_CASO : System.Web.UI.Page
{
    MembershipUser u;
    DateTime ahora = DateTime.Now;

    protected void Page_Load(object sender, EventArgs e)
    {
        u = Membership.GetUser(User.Identity.Name);
        LblUsuario.Text = u.ToString().Trim();
        txtfechapar.Text = ahora.ToString("dd/MM/yyyy");
        if (!IsPostBack)
        {
            UsuarioUnidad();
            asignados();
        }
    }

    private void UsuarioUnidad()
    {
        string strSQL = "SELECT DISTINCT Usuario, Uni_Abrev FROM USUARIOUNIDAD WHERE (Usuario = N'" + LblUsuario.Text.Trim() + "')";
        DataTable dtv = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        SqlCommand cmd = new SqlCommand(strSQL);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        sd.Fill(dtv);
        for (int i = 0; i < dtv.Rows.Count; i++)
        {
            LblUnidad.Text = dtv.Rows[i][1].ToString().Trim();
        }
        SqlConn.Close();
    }

    protected void asignados()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT USUARIO.Usuario, RTRIM(GRADOS.Abrev) + ' ' + RTRIM(USUARIO.NombreApp) AS Expr1 FROM USUARIO INNER JOIN GRUPOS ON USUARIO.Grp_Id = GRUPOS.Grp_Id INNER JOIN DISTRITALES ON GRUPOS.Dis_Id = DISTRITALES.Dis_Id INNER JOIN UNIDADES ON DISTRITALES.Uni_Id = UNIDADES.Uni_Id INNER JOIN GRADOS ON USUARIO.Gr_Id = GRADOS.Gr_Id WHERE (UNIDADES.Uni_Abrev = N'" + LblUnidad.Text.Trim() + "') AND (USUARIO.Rol = 'I') ORDER BY USUARIO.Gr_Id";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        DdlAsignado.ClearSelection();
        DdlAsignado.Items.Clear();
        DdlAsignado.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            DdlAsignado.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }

    protected void GridOperativo_SelectedIndexChanged(object sender, EventArgs e)
    {
        GridViewRow row2 = GridOperativo.SelectedRow;
        lblidope.Text = row2.Cells[0].Text.Trim();
        //txtinfdelpre.Text = row2.Cells[5].Text.Trim();
        txtcasopar.Enabled = true;
        txtasigpar.Enabled = true;
        txtfispar.Enabled = true;
        ddldelito.Enabled = true;
        txtinfdelpre.Enabled = true;
        txtinfinv.Enabled = true;
        txtfechapar.Enabled = true;
        Button10.Enabled = true;        
    }

    protected void Button1_Click(object sender, EventArgs e)
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT ASIGNACION.Casos_Id AS Cas1, UNIDADES.Uni_Descripcion AS Cas2, DISTRITALES.Dis_Descripcion AS Cas3, ASIGNACION.NroOperativo AS Cas4, ASIGNACION.NombreCaso AS Cas5, ASIGNACION.NroCaso AS Cas6, ASIGNACION.AsigCaso AS Cas7, ASIGNACION.FiscalAsigCaso AS Cas8 " +
                                                "FROM ASIGNACION INNER JOIN UNIDADES ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id " +
                                                "WHERE (ASIGNACION.Uni_Abrev = N'" + LblUnidad.Text.Trim() + "') AND (ASIGNACION.NroCaso = N'" + txtnrocaso.Text.Trim().ToUpper() + "') ORDER BY Cas1", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridCasos.DataSource = ds;
        GridCasos.DataBind();
        con.Close();
    }

    protected void Button3_Click(object sender, EventArgs e)
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT ASIGNACION.Casos_Id AS Cas1, UNIDADES.Uni_Descripcion AS Cas2, DISTRITALES.Dis_Descripcion AS Cas3, ASIGNACION.NroOperativo AS Cas4, ASIGNACION.NombreCaso AS Cas5, ASIGNACION.NroCaso AS Cas6, ASIGNACION.AsigCaso AS Cas7, ASIGNACION.FiscalAsigCaso AS Cas8 " +
                                                "FROM ASIGNACION INNER JOIN UNIDADES ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id INNER JOIN INVESTIGADOR ON ASIGNACION.Casos_Id = INVESTIGADOR.Casos_Id " +
                                                "WHERE (INVESTIGADOR.Usuario = N'" + DdlAsignado.SelectedValue.Trim() + "') ORDER BY Cas4", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridCasos.DataSource = ds;
        GridCasos.DataBind();
        con.Close();
    }

    protected void Button6_Click(object sender, EventArgs e)
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT ASIGNACION.Casos_Id AS Cas1, UNIDADES.Uni_Descripcion AS Cas2, DISTRITALES.Dis_Descripcion AS Cas3, ASIGNACION.NroOperativo AS Cas4, ASIGNACION.NombreCaso AS Cas5, ASIGNACION.NroCaso AS Cas6, ASIGNACION.AsigCaso AS Cas7, ASIGNACION.FiscalAsigCaso AS Cas8 " +
                                                "FROM ASIGNACION INNER JOIN UNIDADES ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id " +
                                                "WHERE (ASIGNACION.NroCasoPerDom <> '*') AND (ASIGNACION.NroCaso <> '*') OR (ASIGNACION.NroCasoPerDom <> '*') AND (ASIGNACION.NroCaso = '*') OR (ASIGNACION.NroCasoPerDom = '*') AND (ASIGNACION.NroCaso <> '*') AND (ASIGNACION.Uni_Abrev = N'" + LblUnidad.Text.Trim() + "') AND (ASIGNACION.NombreCaso LIKE N'%" + txtnombcaso.Text.Trim().ToUpper() + "%') ORDER BY Cas1", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridCasos.DataSource = ds;
        GridCasos.DataBind();
        con.Close();
    }

    protected void Button8_Click(object sender, EventArgs e)
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT ASIGNACION.Casos_Id AS Cas1, UNIDADES.Uni_Descripcion AS Cas2, DISTRITALES.Dis_Descripcion AS Cas3, ASIGNACION.NroOperativo AS Cas4, ASIGNACION.NombreCaso AS Cas5, ASIGNACION.NroCaso AS Cas6, ASIGNACION.AsigCaso AS Cas7, ASIGNACION.FiscalAsigCaso AS Cas8 " +
                                                "FROM ASIGNACION INNER JOIN UNIDADES ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id " +
                                                "WHERE (ASIGNACION.Uni_Abrev = N'" + LblUnidad.Text.Trim() + "') AND (ASIGNACION.NroCasoPerDom = N'" + txtperddom.Text.Trim().ToUpper() + "') ORDER BY Cas1", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridCasos.DataSource = ds;
        GridCasos.DataBind();
        con.Close();
    }

    protected void Button5_Click(object sender, EventArgs e)
    {
        Muestracasos();
    }

    private void Muestracasos()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT ASIGNACION.Casos_Id AS Cas1, UNIDADES.Uni_Descripcion AS Cas2, DISTRITALES.Dis_Descripcion AS Cas3, ASIGNACION.NroOperativo AS Cas4, ASIGNACION.NombreCaso AS Cas5, ASIGNACION.NroCaso AS Cas6, ASIGNACION.AsigCaso AS Cas7, ASIGNACION.FiscalAsigCaso AS Cas8 " +
                                                "FROM ASIGNACION INNER JOIN UNIDADES ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id " +
                                                "WHERE (ASIGNACION.NroCasoPerDom <> '*') AND (ASIGNACION.NroCaso <> '*') OR (ASIGNACION.NroCasoPerDom <> '*') AND (ASIGNACION.NroCaso = '*') OR (ASIGNACION.NroCasoPerDom = '*') AND (ASIGNACION.NroCaso <> '*') AND (ASIGNACION.Uni_Abrev = N'" + LblUnidad.Text.Trim() + "') ORDER BY Cas1", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridCasos.DataSource = ds;
        GridCasos.DataBind();
        con.Close();
    }
    protected void Button7_Click(object sender, EventArgs e)
    {
        Response.Redirect("~/FELCN-CASOS/PAR-REG-CASO.aspx");
    }

    protected void GridCasos_SelectedIndexChanged(object sender, EventArgs e)
    {
        GridViewRow row = GridCasos.SelectedRow;
        MuestraOperativos(row.Cells[0].Text.Trim());
        txtcasopar.Text = row.Cells[5].Text.Trim();
        txtasigpar.Text = row.Cells[6].Text.Trim();
        txtfispar.Text = row.Cells[7].Text.Trim();
        lblidcaso.Text = row.Cells[0].Text.Trim();
        lbldpto.Text = CasosParalelos.dpto(Convert.ToInt32(row.Cells[0].Text.Trim()));
        lbluni.Text = CasosParalelos.Unid(Convert.ToInt32(row.Cells[0].Text.Trim()));
        lbldis.Text = CasosParalelos.distrital(Convert.ToInt32(row.Cells[0].Text.Trim()));
        lblgrupo.Text = CasosParalelos.grupo(Convert.ToInt32(row.Cells[0].Text.Trim()));
    }

    private void MuestraOperativos(string casoid)
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT OPERATIVO.Op_Id AS Op1, OPERATIVO.Op_NroOper AS Op2, OPERATIVO.Op_FechaOperativo AS Op3, RTRIM(DEPARTAMENTOS.Descripcion) + ' ' + RTRIM(PROVINCIAS.Descripcion) + ' ' + RTRIM(LOCALIDAD.Descripcion) + ' ' + RTRIM(OPERATIVO.Op_Lugar) AS Op4, RTRIM(UNIDADES.Uni_Descripcion) + ' ' + RTRIM(DISTRITALES.Dis_Descripcion) AS Op5, OPERATIVO.Op_Descripcion AS Op6 " +
                                                "FROM OPERATIVO INNER JOIN DEPARTAMENTOS ON OPERATIVO.Dpto_Id = DEPARTAMENTOS.Dpto_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id INNER JOIN PROVINCIAS ON OPERATIVO.Prov_Id = PROVINCIAS.Prov_Id INNER JOIN LOCALIDAD ON OPERATIVO.Loc_id = LOCALIDAD.Loc_id INNER JOIN DISTRITALES ON OPERATIVO.Dis_Id = DISTRITALES.Dis_Id " +
                                                "WHERE (OPERATIVO.Casos_Id = " + casoid.Trim() + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridOperativo.DataSource = ds;
        GridOperativo.DataBind();
        con.Close();
    }

    protected void Button9_Click(object sender, EventArgs e)
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT ASIGNACION.Casos_Id AS Cas1, UNIDADES.Uni_Descripcion AS Cas2, DISTRITALES.Dis_Descripcion AS Cas3, ASIGNACION.NroOperativo AS Cas4, ASIGNACION.NombreCaso AS Cas5, ASIGNACION.NroCaso AS Cas6, ASIGNACION.AsigCaso AS Cas7, ASIGNACION.FiscalAsigCaso AS Cas8 " +
                                                "FROM ASIGNACION INNER JOIN UNIDADES ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id " +
                                                "WHERE (ASIGNACION.Uni_Abrev = N'" + LblUnidad.Text.Trim() + "') AND (ASIGNACION.NroOperativo = N'" + txtnroope.Text.Trim().ToUpper() + "') ORDER BY Cas1", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridCasos.DataSource = ds;
        GridCasos.DataBind();
        con.Close();
    }
    protected void Button10_Click(object sender, EventArgs e)
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO INVESTPARALELA(Casos_Id, DptoAv_Id, Uni_Abrev, Dis_Id, Grp_Id, Delito, NroCaso, AsigCaso, FiscalAsigCaso, Op_Id, DelitoPresedente, Informe, FechaenvInvPara, Resultado, FecharesInvPara, RespInvParalela, fechahoraing, Usuario) VALUES (@Casos_Id, @DptoAv_Id, @Uni_Abrev, @Dis_Id, @Grp_Id, @Delito, @NroCaso, @AsigCaso, @FiscalAsigCaso, @Op_Id, @DelitoPresedente, @Informe, @FechaenvInvPara, @Resultado, @FecharesInvPara, @RespInvParalela, @fechahoraing, @Usuario)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter Casos_Id = new SqlParameter("@Casos_Id", SqlDbType.Int);
        Casos_Id.Value = Convert.ToInt32(lblidcaso.Text.Trim());
        cmd.Parameters.Add(Casos_Id);
        SqlParameter DptoAv_Id = new SqlParameter("@DptoAv_Id", SqlDbType.NChar, 2);
        DptoAv_Id.Value = lbldpto.Text.Trim();
        cmd.Parameters.Add(DptoAv_Id);
        SqlParameter Uni_Abrev = new SqlParameter("@Uni_Abrev", SqlDbType.NChar, 3);
        Uni_Abrev.Value = lbluni.Text.Trim();
        cmd.Parameters.Add(Uni_Abrev);
        SqlParameter Dis_Id = new SqlParameter("@Dis_Id", SqlDbType.Int);
        Dis_Id.Value = Convert.ToInt32(lbldis.Text.Trim());
        cmd.Parameters.Add(Dis_Id);
        SqlParameter Grp_Id = new SqlParameter("@Grp_Id", SqlDbType.Int);
        Grp_Id.Value = Convert.ToInt32(lblgrupo.Text.Trim());
        cmd.Parameters.Add(Grp_Id);
        SqlParameter Delito = new SqlParameter("@Delito", SqlDbType.NChar, 35);
        Delito.Value = ddldelito.SelectedValue.Trim();            
        cmd.Parameters.Add(Delito);
        if (txtcasopar.Text.Trim() == "")
        {
            SqlParameter NroCaso = new SqlParameter("@NroCaso", SqlDbType.NChar, 20);
            NroCaso.Value = "*";
            cmd.Parameters.Add(NroCaso);
        }
        else
        {
            SqlParameter NroCaso = new SqlParameter("@NroCaso", SqlDbType.NChar, 20);
            NroCaso.Value = txtcasopar.Text.Trim().ToUpper();
            cmd.Parameters.Add(NroCaso);
        }
        SqlParameter AsigCaso = new SqlParameter("@AsigCaso", SqlDbType.NVarChar, 100);
        AsigCaso.Value = txtasigpar.Text.Trim().ToUpper();
        cmd.Parameters.Add(AsigCaso);
        SqlParameter FiscalAsigCaso = new SqlParameter("@FiscalAsigCaso", SqlDbType.NChar, 70);
        FiscalAsigCaso.Value = txtfispar.Text.Trim().ToUpper();
        cmd.Parameters.Add(FiscalAsigCaso);
        SqlParameter Op_Id = new SqlParameter("@Op_Id", SqlDbType.Int);
        Op_Id.Value = Convert.ToInt32(lblidope.Text.Trim());
        cmd.Parameters.Add(Op_Id);
        SqlParameter DelitoPresedente = new SqlParameter("@DelitoPresedente", SqlDbType.Text);
        DelitoPresedente.Value = txtinfdelpre.Text.Trim();
        cmd.Parameters.Add(DelitoPresedente);
        SqlParameter Informe = new SqlParameter("@Informe", SqlDbType.Text);
        Informe.Value = txtinfinv.Text.Trim();
        cmd.Parameters.Add(Informe);
        SqlParameter FechaenvInvPara = new SqlParameter("@FechaenvInvPara", SqlDbType.DateTime);
        FechaenvInvPara.Value = Convert.ToDateTime(txtfechapar.Text.Trim());
        cmd.Parameters.Add(FechaenvInvPara);
        SqlParameter Resultado = new SqlParameter("@Resultado", SqlDbType.Int);
        Resultado.Value = Convert.ToInt32("0"); ;
        cmd.Parameters.Add(Resultado);
        SqlParameter FecharesInvPara = new SqlParameter("@FecharesInvPara", SqlDbType.DateTime);
        FecharesInvPara.Value = DBNull.Value;
        cmd.Parameters.Add(FecharesInvPara);
        SqlParameter RespInvParalela = new SqlParameter("@RespInvParalela", SqlDbType.Int);
        RespInvParalela.Value = Convert.ToInt32("0"); ;
        cmd.Parameters.Add(RespInvParalela);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = u.UserName;
        cmd.Parameters.Add(Usuario);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
        Response.Redirect("~/FELCN-CASOS/PAR-REG-CASO.aspx");
    }
}