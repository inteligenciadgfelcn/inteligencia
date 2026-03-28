using GMapGeocoder;
using Subgurim.Controles;
using System;
using System.Activities.Expressions;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Forms_FRM_OP : System.Web.UI.Page
{
    string usuariolog = HttpContext.Current.User.Identity.Name;
    DateTime ahora = DateTime.Now;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            string valoring = Request.QueryString[0];            
            muestradatos(valoring.Trim());            
        }
    }
    private void muestradatos(string datos)
    {
        string strSQLverif = "SELECT Casos_Id, NombreCaso, FSolicitud, FonoS, AsigCaso, FonoA, FiscalAsigCaso, FonoF, NroOperativo, NroCaso FROM ASIGNACION " +
                             "WHERE (Casos_Id = " + Convert.ToInt32(datos.Trim()) + ")";
        DataTable dtlista = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        SqlCommand cmdrev = new SqlCommand(strSQLverif);
        cmdrev.CommandType = CommandType.Text;
        cmdrev.Connection = SqlConn;
        SqlDataAdapter sdrev = new SqlDataAdapter(cmdrev);
        sdrev.Fill(dtlista);
        for (int i = 0; i < dtlista.Rows.Count; i++)
        {
            lblidcaso.Text = dtlista.Rows[i][0].ToString();
            txtnombrecaso.Text = dtlista.Rows[i][1].ToString();
            txtsolicita.Text = dtlista.Rows[i][2].ToString();
            fonosolicita.Text = dtlista.Rows[i][3].ToString();
            txtasignadocaso.Text = dtlista.Rows[i][4].ToString();
            fonoasignado.Text = dtlista.Rows[i][5].ToString();
            txtfiscalasignado.Text = dtlista.Rows[i][6].ToString();
            fonofiscal.Text = dtlista.Rows[i][7].ToString();
            txtnroop.Text = dtlista.Rows[i][8].ToString();            
        }
        SqlConn.Close();
        DateTime fechaop = Convert.ToDateTime(Servicio.fechaope(txtnroop.Text.Trim()));
        txtfechaoperativo.Text = fechaop.ToString().Trim();
        if (idvalor(lblidcaso.Text.Trim()) == 0)
        {
            muestra_vacio();
        }
        else
        {
            muestra_operativo(lblidcaso.Text.Trim());
        }
    }
    private Int32 idvalor(string valor)
    {
        Int32 cuentareg = 0;
        string strSQL2 = "SELECT COUNT(Op_Id) AS Expr1 FROM OPERATIVO WHERE (Casos_Id = " + Convert.ToInt32(valor.Trim()) + ") AND (Op_Revisado = 0)";
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        SqlCommand cmd = new SqlCommand(strSQL2);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        sd.Fill(dt);
        int retorna = 0;
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cuentareg = Convert.ToInt32(dt.Rows[i][0].ToString());
        }
        retorna = cuentareg;
        SqlConn.Close();
        return retorna;
    }
    private void muestra_vacio()
    {
        //txtfechaoperativo.Text = ahora.ToString();        
        /*Datos Operativos*/
        CboRelevancia();       
        TipoDenuncia();
        TipoPenal();        
        Departamento();       
        Categoria();
        CboUnid();        
        PlandeOperaciones();       
        TipoOperativos();
        /*inicia subcategorias*/
        TipoDrogas();
        FormaTrans();
        Pais_Detenido();
        Procedencia_Droga();
        Destino_Droga();
        /*sus solidas*/
        TipoSusSolidas();
        /*sus liquidas*/
        TipoSusliquidas();
        /*fabricas pozas*/
        Tipofabricas();
        /*Bienes Secuestrados*/
        Bienes();        
    }
    private void muestra_operativo(string idcaso)
    {
        string strSQL2 = "SELECT Op_Id, Casos_Id, TiRel_Id, Op_NroOper, Ti_Den_Id, Ti_Pen_Id, Op_FechaOperativo, Dpto_Id, Prov_Id, Loc_id, Op_Lugar, Lugop_id, itemop_id, Uni_Id, Dis_Id, Grp_Id, Op_Mando, Op_gradosx, Op_minx, Op_segx, Op_Coordx, Op_gradosy, Op_miny, Op_segy, Op_Coordy, PlanOp_Id, BreveDetalle, Op_Descripcion, TiOp_Id, Organizacion, Clanfamiliar, Op_Revisado, Positivo, Aprehendido, Arrestado, Op_Icia, ParteDiario, fechahoraing, Usuario " +
                         "FROM OPERATIVO WHERE (Casos_Id = " + Convert.ToInt32(idcaso.Trim()) + ")";
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        SqlCommand cmd = new SqlCommand(strSQL2);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        sd.Fill(dt);
        string indice;
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            lblidop.Text = dt.Rows[i][0].ToString();
            indice = dt.Rows[i][2].ToString();
            CboRelevancia();
            cborelevancia.SelectedIndex = cborelevancia.Items.IndexOf(cborelevancia.Items.FindByValue(indice));
            indice = dt.Rows[i][4].ToString();
            TipoDenuncia();
            cbotipodenuncia.SelectedIndex = cbotipodenuncia.Items.IndexOf(cbotipodenuncia.Items.FindByValue(indice));
            indice = dt.Rows[i][5].ToString();
            TipoPenal();
            cbotipopenal.SelectedIndex = cbotipopenal.Items.IndexOf(cbotipopenal.Items.FindByValue(indice));
            txtfechaoperativo.Text = dt.Rows[i][6].ToString();
            indice = dt.Rows[i][7].ToString();
            Departamento();
            cbodepartamento.SelectedIndex = cbodepartamento.Items.IndexOf(cbodepartamento.Items.FindByValue(indice));
            indice = dt.Rows[i][8].ToString();
            Provincia();
            cboprovincia.SelectedIndex = cboprovincia.Items.IndexOf(cboprovincia.Items.FindByValue(indice));
            indice = dt.Rows[i][9].ToString();
            Localidad();
            cbomunicipio.SelectedIndex = cbomunicipio.Items.IndexOf(cbomunicipio.Items.FindByValue(indice));
            txtlugar.Text = dt.Rows[i][10].ToString();
            indice = dt.Rows[i][11].ToString();
            Categoria();
            cbocategoria.SelectedIndex = cbocategoria.Items.IndexOf(cbocategoria.Items.FindByValue(indice));
            indice = dt.Rows[i][12].ToString();
            Subcategoria();
            cbosubcategoria.SelectedIndex = cbosubcategoria.Items.IndexOf(cbosubcategoria.Items.FindByValue(indice));
            indice = dt.Rows[i][13].ToString();
            CboUnid();
            cbounidad.SelectedIndex = cbounidad.Items.IndexOf(cbounidad.Items.FindByValue(indice));
            indice = dt.Rows[i][14].ToString();
            CboDistrital();
            cboDistrital.SelectedIndex = cboDistrital.Items.IndexOf(cboDistrital.Items.FindByValue(indice));
            indice = dt.Rows[i][15].ToString();
            CboGrupo();
            cboGrupo.SelectedIndex = cboGrupo.Items.IndexOf(cboGrupo.Items.FindByValue(indice));
            TxtAlMando.Text = dt.Rows[i][16].ToString();
            grax.Text = dt.Rows[i][17].ToString();
            minx.Text = dt.Rows[i][18].ToString();
            segx.Text = dt.Rows[i][19].ToString();
            txtlat.Text = dt.Rows[i][20].ToString();
            gray.Text = dt.Rows[i][21].ToString();
            miny.Text = dt.Rows[i][22].ToString();
            segy.Text = dt.Rows[i][23].ToString();
            txtlng.Text = dt.Rows[i][24].ToString();
            indice = dt.Rows[i][25].ToString();
            PlandeOperaciones();
            cboplanoperaciones.SelectedIndex = cboplanoperaciones.Items.IndexOf(cboplanoperaciones.Items.FindByValue(indice));
            txtbrevedetalle.Text = dt.Rows[i][26].ToString();
            indice = dt.Rows[i][28].ToString();
            TipoOperativos();
            cbotipoop.SelectedIndex = cbotipoop.Items.IndexOf(cbotipoop.Items.FindByValue(indice));
            txtorganizacion.Text = dt.Rows[i][29].ToString();
            txtclanfamiliar.Text = dt.Rows[i][30].ToString();
            txtnroop.Enabled = false;
            txtnroinf.Enabled = false;
            txtnombrecaso.Enabled = false;
            cbounidad.Enabled = false;
            cboDistrital.Enabled = false;
            cboGrupo.Enabled = false;
            txtsolicita.Enabled = false;
            fonosolicita.Enabled = false;
            txtasignadocaso.Enabled = false;
            fonoasignado.Enabled = false;
            txtfiscalasignado.Enabled = false;
            fonofiscal.Enabled = false;
            cbotipodenuncia.Enabled = false;
            cbotipopenal.Enabled = false;
            txtfechaoperativo.Enabled = false;
            cbodepartamento.Enabled = false;
            cboprovincia.Enabled = false;
            cbomunicipio.Enabled = false;
            txtlugar.Enabled = false;
            cbocategoria.Enabled = false;
            cbosubcategoria.Enabled = false;
            TxtAlMando.Enabled = false;
            cboplanoperaciones.Enabled = false;
            cbotipoop.Enabled = false;
            txtclanfamiliar.Enabled = false;
            txtorganizacion.Enabled = false;
            grax.Enabled = false;
            minx.Enabled = false;
            segx.Enabled = false;
            gray.Enabled = false;
            miny.Enabled = false;
            segy.Enabled = false;
            txtbrevedetalle.Enabled = false;
            Button1.Enabled = false;
            Button1.Visible = false;
            btnmarcar.Enabled = false;
            btnmarcar.Visible = false;
            txtbrevedetalle.Focus();
            /*inicia subcategorias*/
            cargamapa(Convert.ToInt32(dt.Rows[i][1].ToString()));
            TipoDrogas();
            FormaTrans();
            Pais_Detenido();
            Procedencia_Droga();
            Destino_Droga();
            /*sus solidas*/
            TipoSusSolidas();
            /*sus liquidas*/
            TipoSusliquidas();
            /*fabricas pozas*/
            Tipofabricas();
            /*Bienes Secuestrados*/
            Bienes();
            /*Muestra Registros*/
            MuestraDrogas();
            muestrapesaje();
            MuestraSusSolidas();
            MuestraSusliquidas();
            Muestrafabrica();
            muestradet();
            Muestrabienes();
            MuestrabienesGeneral();
            muestraLogos();
            muestragaleria();
        }
    }    
    private void CboRelevancia()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT TiRel_Id, Descripcion FROM TIPORELEVANCIA";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cborelevancia.ClearSelection();
        cborelevancia.Items.Clear();
        cborelevancia.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cborelevancia.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void CboUnid()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Uni_Id, Uni_Descripcion FROM UNIDADES";
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
    private void CboDistrital()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Dis_Id, Dis_Descripcion FROM DISTRITALES WHERE (Uni_Id =" + Convert.ToInt32(cbounidad.SelectedValue) + ")";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);        
        cboGrupo.ClearSelection();
        cboGrupo.Items.Clear();
        cboDistrital.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cboDistrital.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void cbounidad_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Dis_Id, Dis_Descripcion FROM DISTRITALES WHERE (Uni_Id =" + Convert.ToInt32(cbounidad.SelectedValue) + ")";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cboDistrital.ClearSelection();
        cboDistrital.Items.Clear();
        cboGrupo.ClearSelection();
        cboGrupo.Items.Clear();
        cboDistrital.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cboDistrital.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void CboGrupo()
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
    private void TipoDenuncia()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Ti_Den_Id, Descripcion FROM TIPODENUNCIA";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbotipodenuncia.ClearSelection();
        cbotipodenuncia.Items.Clear();
        cbotipodenuncia.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbotipodenuncia.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void TipoPenal()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Ti_Pen_Id, Descripcion FROM TIPOPENAL";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbotipopenal.ClearSelection();
        cbotipopenal.Items.Clear();
        cbotipopenal.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbotipopenal.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void Departamento()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Dpto_Id, Descripcion FROM DEPARTAMENTOS";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbodepartamento.ClearSelection();
        cbodepartamento.Items.Clear();
        cboprovincia.ClearSelection();
        cboprovincia.Items.Clear();
        cbomunicipio.ClearSelection();
        cbomunicipio.Items.Clear();
        cbodepartamento.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbodepartamento.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void Provincia()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Prov_Id, Descripcion FROM  PROVINCIAS WHERE (Dpto_Id = '" + Convert.ToInt32(cbodepartamento.SelectedValue) + "')";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cboprovincia.ClearSelection();
        cboprovincia.Items.Clear();
        cboprovincia.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cboprovincia.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }

    private void Localidad()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Loc_id, Descripcion FROM LOCALIDAD WHERE (Prov_Id = '" + Convert.ToInt32(cboprovincia.SelectedValue) + "')";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbomunicipio.ClearSelection();
        cbomunicipio.Items.Clear();
        cbomunicipio.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbomunicipio.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void cbodepartamento_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Prov_Id, Descripcion FROM  PROVINCIAS WHERE (Dpto_Id = '" + Convert.ToInt32(cbodepartamento.SelectedValue) + "')";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cboprovincia.ClearSelection();
        cboprovincia.Items.Clear();
        cboprovincia.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cboprovincia.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void cboprovincia_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Loc_id, Descripcion FROM LOCALIDAD WHERE (Prov_Id = '" + Convert.ToInt32(cboprovincia.SelectedValue) + "') ORDER BY Descripcion";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbomunicipio.ClearSelection();
        cbomunicipio.Items.Clear();
        cbomunicipio.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbomunicipio.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void PlandeOperaciones()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT PlanOp_Id, PlanOp_Nombre + '  ' + PlanOp_Gestion AS Expr1 FROM PLAN_OPERACIONES";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cboplanoperaciones.ClearSelection();
        cboplanoperaciones.Items.Clear();
        cboplanoperaciones.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cboplanoperaciones.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void Categoria()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Lugop_id, Descripcion FROM CATEGORIAOPERATIVO";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbocategoria.ClearSelection();
        cbocategoria.Items.Clear();
        cbocategoria.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbocategoria.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void Subcategoria()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT itemop_id, Descripcion FROM ITEMOPERATIVO WHERE (Lugop_id = '" + Convert.ToInt32(cbocategoria.SelectedValue) + "')";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbosubcategoria.ClearSelection();
        cbosubcategoria.Items.Clear();
        cbosubcategoria.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbosubcategoria.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void cbocategoria_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT itemop_id, Descripcion FROM ITEMOPERATIVO WHERE (Lugop_id = '" + Convert.ToInt32(cbocategoria.SelectedValue) + "')";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbosubcategoria.ClearSelection();
        cbosubcategoria.Items.Clear();
        cbosubcategoria.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbosubcategoria.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void TipoOperativos()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT TiOp_Id, Descripcion FROM TIPOOP";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbotipoop.ClearSelection();
        cbotipoop.Items.Clear();
        cbotipoop.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbotipoop.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void marcar(double latitud, double longitud, string iconon, string texto)
    {        
        GLatLng latlng = new GLatLng(latitud, longitud);
        GMap1.setCenter(latlng, 15);
        GIcon icon = new GIcon();
        icon.image = iconon;
        icon.iconSize = new GSize(32, 32);
        icon.iconAnchor = new GPoint(32, 32);
        icon.infoWindowAnchor = new GPoint(5, 0);
        GMarkerOptions mOpts = new GMarkerOptions();
        mOpts.clickable = true;
        mOpts.icon = icon;
        GInfoWindow window = new GInfoWindow(new GMarker(latlng, mOpts), texto);
        GMap1.Add(window);
        GMarker marker = new GMarker(latlng, mOpts);
        GMap1.Add(marker);
        GMap1.Add(window);
        GMap1.Add(new GMapUI());
        GMapUIOptions options = new GMapUIOptions();
        options.keyboard = true;
        options.maptypes_satellite = true;
        options.zoom_scrollwheel = true;
        GMap1.Add(new GMapUI(options));
    }
    private void cargamapa(int idcasos)
    {
        //GMap1.resetMarkers();
        //GMap1.resetInfoWindows();
        //GMap1.reset();
        GMapUIOptions options = new GMapUIOptions();        
        options.keyboard = true;
        options.maptypes_satellite = true;        
        options.zoom_scrollwheel = true;
        GMap1.Add(new GMapUI(options));
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        SqlDataAdapter sda = new SqlDataAdapter();
        string strQuery = "SELECT Op_Id AS G1, Op_NroOper AS G2, Op_Coordx AS G3, Op_Coordy AS G4, Op_Lugar AS G5 FROM OPERATIVO WHERE (Casos_Id = " + idcasos + ")";
        SqlCommand cmd = new SqlCommand(strQuery);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        sda.SelectCommand = cmd;
        sda.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            string val1 = dt.Rows[i][2].ToString();
            string val2 = dt.Rows[i][3].ToString();
            string imgpng = "https://casos.felcn.gob.bo/assets/images/ubicacion.png";
            string strMarker = "Descripcion: " + dt.Rows[i][1].ToString();
            marcar(System.Convert.ToDouble(val1), System.Convert.ToDouble(val2), imgpng, strMarker);
        }
    }
    protected void btnmarcar_Click(object sender, EventArgs e)
    {
        GMap1.resetMarkers();
        GMap1.resetInfoWindows();
        GMap1.reset();
        GMapUIOptions options = new GMapUIOptions();
        options.keyboard = true;
        options.maptypes_satellite = true;
        options.zoom_scrollwheel = true;
        GMap1.Add(new GMapUI(options));
        double coordx = (Convert.ToDouble(grax.Text.Trim()) + (Convert.ToDouble(minx.Text.Trim()) / 60) + (Convert.ToDouble(segx.Text.Trim()) / 3600)) * (-1);
        double coordy = (Convert.ToDouble(gray.Text.Trim()) + (Convert.ToDouble(miny.Text.Trim()) / 60) + (Convert.ToDouble(segy.Text.Trim()) / 3600)) * (-1);
        txtlat.Text = coordx.ToString();
        txtlng.Text = coordy.ToString();
        string imgpng = "https://casos.felcn.gob.bo/assets/images/ubicacion.png";
        marcar(System.Convert.ToDouble(txtlat.Text.Trim()), System.Convert.ToDouble(txtlng.Text.Trim()), imgpng, "Lugar del Operativo");
        GMap1.mapType = GMapType.GTypes.Satellite;
        txtbrevedetalle.Focus();
    }
    protected void Button1_Click(object sender, EventArgs e)
    {
        Page.Validate("operativo");
        if (Page.IsValid)
        { 
            DateTime ahora = DateTime.Now;
            string ret;
            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            SqlCommand cmd = new SqlCommand();
            cmd.CommandText = "INSERT INTO OPERATIVO(Casos_Id, TiRel_Id, Op_NroOper, Ti_Den_Id, Ti_Pen_Id, Op_FechaOperativo, Dpto_Id, Prov_Id, Loc_id, Op_Lugar, Lugop_id, itemop_id, Uni_Id, Dis_Id, Grp_Id, Op_Mando, Op_gradosx, Op_minx, Op_segx, Op_Coordx, Op_gradosy, Op_miny, Op_segy, Op_Coordy, PlanOp_Id, BreveDetalle, Op_Descripcion, TiOp_Id, Organizacion, Clanfamiliar, Op_Revisado, Positivo, Aprehendido, Arrestado, Op_Icia, ParteDiario, fechahoraing, Usuario) VALUES (@Casos_Id, @TiRel_Id, @Op_NroOper, @Ti_Den_Id, @Ti_Pen_Id, @Op_FechaOperativo, @Dpto_Id, @Prov_Id, @Loc_id, @Op_Lugar, @Lugop_id, @itemop_id, @Uni_Id, @Dis_Id, @Grp_Id, @Op_Mando, @Op_gradosx, @Op_minx, @Op_segx, @Op_Coordx, @Op_gradosy, @Op_miny, @Op_segy, @Op_Coordy, @PlanOp_Id, @BreveDetalle, @Op_Descripcion, @TiOp_Id, @Organizacion, @Clanfamiliar, @Op_Revisado, @Positivo, @Aprehendido, @Arrestado, @Op_Icia, @ParteDiario, @fechahoraing, @Usuario) ;SELECT  Scope_Identity();";
            cmd.CommandType = CommandType.Text;
            cmd.Connection = con;
            SqlParameter NroCaso = new SqlParameter("@Casos_Id", SqlDbType.Int);
            NroCaso.Value = Convert.ToInt32(lblidcaso.Text.Trim());
            cmd.Parameters.Add(NroCaso);
            SqlParameter TiRel_Id = new SqlParameter("@TiRel_Id", SqlDbType.Int);
            TiRel_Id.Value = Convert.ToInt32(cborelevancia.SelectedValue.Trim());
            cmd.Parameters.Add(TiRel_Id);
            SqlParameter Op_NroOper = new SqlParameter("@Op_NroOper", SqlDbType.NChar, 20);
            Op_NroOper.Value = txtnroinf.Text.Trim().ToUpper();
            cmd.Parameters.Add(Op_NroOper);
            SqlParameter Ti_Den_Id = new SqlParameter("@Ti_Den_Id", SqlDbType.Int);
            Ti_Den_Id.Value = Convert.ToInt32(cbotipodenuncia.SelectedValue);
            cmd.Parameters.Add(Ti_Den_Id);
            SqlParameter Ti_Pen_Id = new SqlParameter("@Ti_Pen_Id", SqlDbType.Int);
            Ti_Pen_Id.Value = Convert.ToInt32(cbotipopenal.SelectedValue);
            cmd.Parameters.Add(Ti_Pen_Id);
            SqlParameter Op_FechaOperativo = new SqlParameter("@Op_FechaOperativo", SqlDbType.DateTime);
            Op_FechaOperativo.Value = Convert.ToDateTime(txtfechaoperativo.Text.Trim());
            cmd.Parameters.Add(Op_FechaOperativo);
            SqlParameter Dpto_Id = new SqlParameter("@Dpto_Id", SqlDbType.Int);
            Dpto_Id.Value = Convert.ToInt32(cbodepartamento.SelectedValue);
            cmd.Parameters.Add(Dpto_Id);
            SqlParameter Prov_Id = new SqlParameter("@Prov_Id", SqlDbType.Int);
            Prov_Id.Value = Convert.ToInt32(cboprovincia.SelectedValue);
            cmd.Parameters.Add(Prov_Id);
            SqlParameter Loc_id = new SqlParameter("@Loc_id", SqlDbType.Int);
            Loc_id.Value = Convert.ToInt32(cbomunicipio.SelectedValue);
            cmd.Parameters.Add(Loc_id);
            SqlParameter Op_Lugar = new SqlParameter("@Op_Lugar", SqlDbType.NVarChar, 255);
            Op_Lugar.Value = txtlugar.Text.ToUpper().Trim();
            cmd.Parameters.Add(Op_Lugar);
            SqlParameter Lugop_id = new SqlParameter("@Lugop_id", SqlDbType.Int);
            Lugop_id.Value = Convert.ToInt32(cbocategoria.SelectedValue);
            cmd.Parameters.Add(Lugop_id);
            SqlParameter itemop_id = new SqlParameter("@itemop_id", SqlDbType.Int);
            itemop_id.Value = Convert.ToInt32(cbosubcategoria.SelectedValue);
            cmd.Parameters.Add(itemop_id);
            SqlParameter Uni_Id = new SqlParameter("@Uni_Id", SqlDbType.Int);
            Uni_Id.Value = Convert.ToInt32(cbounidad.SelectedValue);
            cmd.Parameters.Add(Uni_Id);
            SqlParameter Dis_Id = new SqlParameter("@Dis_Id", SqlDbType.Int);
            Dis_Id.Value = Convert.ToInt32(cboDistrital.SelectedValue);
            cmd.Parameters.Add(Dis_Id);
            SqlParameter Grp_Id = new SqlParameter("@Grp_Id", SqlDbType.Int);
            Grp_Id.Value = Convert.ToInt32(cboGrupo.SelectedValue);
            cmd.Parameters.Add(Grp_Id);
            SqlParameter Op_Mando = new SqlParameter("@Op_Mando", SqlDbType.NVarChar, 150);
            Op_Mando.Value = TxtAlMando.Text.Trim().ToUpper();
            cmd.Parameters.Add(Op_Mando);
            SqlParameter Op_gradosx = new SqlParameter("@Op_gradosx", SqlDbType.Int);
            Op_gradosx.Value = Convert.ToInt32(grax.Text.Trim());
            cmd.Parameters.Add(Op_gradosx);
            SqlParameter Op_minx = new SqlParameter("@Op_minx", SqlDbType.Int);
            Op_minx.Value = Convert.ToInt32(minx.Text.Trim());
            cmd.Parameters.Add(Op_minx);
            SqlParameter Op_segx = new SqlParameter("@Op_segx", SqlDbType.Float);
            Op_segx.Value = Convert.ToDecimal(segx.Text.Trim());
            cmd.Parameters.Add(Op_segx);
            SqlParameter Op_Coordx = new SqlParameter("@Op_Coordx", SqlDbType.Float);
            Op_Coordx.Value = (Convert.ToDouble(grax.Text.Trim()) + (Convert.ToDouble(minx.Text.Trim()) / 60) + (Convert.ToDouble(segx.Text.Trim()) / 3600)) * (-1);
            cmd.Parameters.Add(Op_Coordx);
            SqlParameter Op_gradosy = new SqlParameter("@Op_gradosy", SqlDbType.Int);
            Op_gradosy.Value = Convert.ToInt32(gray.Text.Trim());
            cmd.Parameters.Add(Op_gradosy);
            SqlParameter Op_miny = new SqlParameter("@Op_miny", SqlDbType.Int);
            Op_miny.Value = Convert.ToInt32(miny.Text.Trim());
            cmd.Parameters.Add(Op_miny);
            SqlParameter Op_segy = new SqlParameter("@Op_segy", SqlDbType.Float);
            Op_segy.Value = Convert.ToDecimal(segy.Text.Trim());
            cmd.Parameters.Add(Op_segy);
            SqlParameter Op_Coordy = new SqlParameter("@Op_Coordy", SqlDbType.Float);
            Op_Coordy.Value = (Convert.ToDouble(gray.Text.Trim()) + (Convert.ToDouble(miny.Text.Trim()) / 60) + (Convert.ToDouble(segy.Text.Trim()) / 3600)) * (-1);
            cmd.Parameters.Add(Op_Coordy);
            SqlParameter PlanOp_Id = new SqlParameter("@PlanOp_Id", SqlDbType.Int);
            PlanOp_Id.Value = Convert.ToInt32(cboplanoperaciones.SelectedValue);
            cmd.Parameters.Add(PlanOp_Id);
            SqlParameter BreveDetalle = new SqlParameter("@BreveDetalle", SqlDbType.Text);
            BreveDetalle.Value = txtbrevedetalle.Text.Trim();
            cmd.Parameters.Add(BreveDetalle);
            SqlParameter Op_Descripcion = new SqlParameter("@Op_Descripcion", SqlDbType.Text);
            Op_Descripcion.Value = "";
            cmd.Parameters.Add(Op_Descripcion);
            SqlParameter TiOp_Id = new SqlParameter("@TiOp_Id", SqlDbType.Int);
            TiOp_Id.Value = Convert.ToInt32(cbotipoop.SelectedValue);
            cmd.Parameters.Add(TiOp_Id);
            if (txtorganizacion.Text.Trim() == "")
            {
                SqlParameter Organizacion = new SqlParameter("@Organizacion", SqlDbType.NVarChar, 50);
                Organizacion.Value = txtorganizacion.Text.Trim().ToUpper();
                cmd.Parameters.Add(Organizacion);
            }
            else
            {
                SqlParameter Organizacion = new SqlParameter("@Organizacion", SqlDbType.NVarChar, 50);
                Organizacion.Value = "";
                cmd.Parameters.Add(Organizacion);
            }
            if (txtclanfamiliar.Text.Trim() == "")
            {
                SqlParameter Organizacion = new SqlParameter("@Clanfamiliar", SqlDbType.NVarChar, 50);
                Organizacion.Value = txtclanfamiliar.Text.Trim().ToUpper();
                cmd.Parameters.Add(Organizacion);
            }
            else
            {
                SqlParameter Organizacion = new SqlParameter("@Clanfamiliar", SqlDbType.NVarChar, 50);
                Organizacion.Value = "";
                cmd.Parameters.Add(Organizacion);
            }
            SqlParameter Op_Revisado = new SqlParameter("@Op_Revisado", SqlDbType.Int);
            Op_Revisado.Value = Convert.ToInt32("0");
            cmd.Parameters.Add(Op_Revisado);
            SqlParameter Positivo = new SqlParameter("@Positivo", SqlDbType.Int);
            Positivo.Value = Convert.ToInt32("1");
            cmd.Parameters.Add(Positivo);
            SqlParameter Aprehendido = new SqlParameter("@Aprehendido", SqlDbType.Int);
            Aprehendido.Value = Convert.ToInt32("0");
            cmd.Parameters.Add(Aprehendido);
            SqlParameter Arrestado = new SqlParameter("@Arrestado", SqlDbType.Int);
            Arrestado.Value = Convert.ToInt32("0");
            cmd.Parameters.Add(Arrestado);
            if (Convert.ToInt32("0") == 1)
            {
                SqlParameter Op_Icia = new SqlParameter("@Op_Icia", SqlDbType.Int);
                Op_Icia.Value = Convert.ToInt32("0");
                cmd.Parameters.Add(Op_Icia);
            }
            else
            {
                SqlParameter Op_Icia = new SqlParameter("@Op_Icia", SqlDbType.Int);
                Op_Icia.Value = Convert.ToInt32("1");
                cmd.Parameters.Add(Op_Icia);
            }
            SqlParameter ParteDiario = new SqlParameter("@ParteDiario", SqlDbType.Int);
            ParteDiario.Value = Convert.ToInt32("0");
            cmd.Parameters.Add(ParteDiario);
            SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
            fechahoraing.Value = ahora;
            cmd.Parameters.Add(fechahoraing);
            SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
            Usuario.Value = usuariolog.Trim();
            cmd.Parameters.Add(Usuario);
            con.Open();
            ret = cmd.ExecuteScalar().ToString();
            con.Close();
            lblidop.Text=ret.Trim();
            inhabilita();
        }
    }
    // * inhabilitar controles * //
    private void inhabilita()
    {
        txtnroop.Enabled = false;
        txtnroinf.Enabled = false;
        txtnombrecaso.Enabled = false;
        cbounidad.Enabled = false;
        cboDistrital.Enabled = false;
        cboGrupo.Enabled = false;
        txtsolicita.Enabled = false;
        fonosolicita.Enabled = false;
        txtasignadocaso.Enabled = false;
        fonoasignado.Enabled = false;
        txtfiscalasignado.Enabled = false;
        fonofiscal.Enabled = false;
        cbotipodenuncia.Enabled = false;
        cbotipopenal.Enabled = false;
        txtfechaoperativo.Enabled = false;
        cbodepartamento.Enabled = false;
        cboprovincia.Enabled = false;
        cbomunicipio.Enabled = false;
        txtlugar.Enabled = false;
        cbocategoria.Enabled = false;
        cbosubcategoria.Enabled = false;
        TxtAlMando.Enabled = false;
        cboplanoperaciones.Enabled = false;
        cbotipoop.Enabled = false;
        txtclanfamiliar.Enabled = false;
        txtorganizacion.Enabled = false;
        grax.Enabled = false;
        minx.Enabled = false;
        segx.Enabled = false;
        gray.Enabled = false;
        miny.Enabled = false;
        segy.Enabled = false;
        txtbrevedetalle.Enabled = false;
        //txtDetalle.Enabled = false;
        Button1.Enabled = false;
        Button1.Visible = false;
        lblidop.Visible = false;
    }
    // * insercion de subcategoorias * //
    private void TipoDrogas()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Td_Id, Descripcion FROM TIPOSDROGA ORDER BY Descripcion";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbotipodrogas.ClearSelection();
        cbotipodrogas.Items.Clear();
        cboestadodroga.ClearSelection();
        cboestadodroga.Items.Clear();
        cbotipodrogas.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbotipodrogas.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }   
    protected void cbotipodrogas_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT ESTADODROGA.EstDg_Id AS Expr1, ESTADODROGA.Descripcion AS Expr2 FROM ESTADODROGA INNER JOIN TIPOSDROGA ON ESTADODROGA.Td_Id = TIPOSDROGA.Td_Id WHERE (TIPOSDROGA.Td_Id =" + Convert.ToInt32(cbotipodrogas.SelectedValue) + ")";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cboestadodroga.ClearSelection();
        cboestadodroga.Items.Clear();
        cboestadodroga.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cboestadodroga.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
        cboestadodroga.Focus();
    }
    private void FormaTrans()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Formas_Id, Formas_Descripcion FROM FORMASTRANS";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cboformatran.ClearSelection();
        cboformatran.Items.Clear();
        cboformatran.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cboformatran.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void Procedencia_Droga()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Pa_Id, Descripcion FROM PAIS ORDER BY Descripcion";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cboproceden.ClearSelection();
        cboproceden.Items.Clear();
        cboproceden.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cboproceden.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
        string indice = "70";
        cboproceden.SelectedIndex = cboproceden.Items.IndexOf(cboproceden.Items.FindByValue(indice));
    }
    private void Destino_Droga()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Pa_Id, Descripcion FROM PAIS ORDER BY Descripcion";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbodestino.ClearSelection();
        cbodestino.Items.Clear();
        cbodestino.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbodestino.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
        string indice = "70";
        cbodestino.SelectedIndex = cbodestino.Items.IndexOf(cbodestino.Items.FindByValue(indice));
    }
    private void limpiadrogas()
    {
        txtcantn.Text = "";
        txtcankl.Text = "";
        txtcantgr.Text = "";
        txtcantunid.Text = "";
        txtcantmg.Text = "";
        txtdrliq.Text = "";
        TipoDrogas();
        FormaTrans();
        Procedencia_Droga();
        Destino_Droga();
        cbotipodrogas.Focus();
    }
    private void MuestraDrogas()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT DROGAS.Dg_Id AS droga1, TIPOSDROGA.Descripcion AS droga2, ESTADODROGA.Descripcion AS droga3, DROGAS.Dg_Cantidad AS droga4, DROGAS.Capsulas AS droga5, FORMASTRANS.Formas_Descripcion AS droga6, PAIS.Descripcion AS droga7, PAIS_1.Descripcion AS droga8 " +
                                                "FROM DROGAS INNER JOIN ESTADODROGA ON DROGAS.EstDg_Id = ESTADODROGA.EstDg_Id INNER JOIN FORMASTRANS ON DROGAS.Formas_Id = FORMASTRANS.Formas_Id INNER JOIN PAIS ON DROGAS.Pa_Id = PAIS.Pa_Id INNER JOIN TIPOSDROGA ON ESTADODROGA.Td_Id = TIPOSDROGA.Td_Id INNER JOIN OPERATIVO ON DROGAS.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id INNER JOIN PAIS AS PAIS_1 ON DROGAS.D_Pa_Id = PAIS_1.Pa_Id " +
                                                "WHERE (OPERATIVO.Op_Id = " + Convert.ToInt32(lblidop.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridView1.DataSource = ds;
        GridView1.DataBind();
        con.Close();
    }
    protected void GridView1_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        string id = GridView1.Rows[e.RowIndex].Cells[0].Text;
        deletedrogas(id);
        MuestraDrogas();
        muestrapesaje();
    }
    private void deletedrogas(string codigo)
    {
        string sql = "Delete DROGAS Where Dg_Id =" + codigo;
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXSIII);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
    }
    protected void btninsdroga_Click(object sender, EventArgs e)
    {
        Page.Validate("operativo");
        if (Page.IsValid)
        {
            float sumadroga = 0;
            if (txtcantn.Text != "")
            {
                sumadroga = sumadroga + Convert.ToInt32(txtcantn.Text.Trim()) * 1000000;
            }
            if (txtcankl.Text != "")
            {
                sumadroga = sumadroga + Convert.ToInt32(txtcankl.Text.Trim()) * 1000;
            }
            if (txtcantgr.Text != "")
            {
                sumadroga = sumadroga + Convert.ToInt32(txtcantgr.Text.Trim());
            }
            if (txtcantmg.Text != "")
            {
                sumadroga = sumadroga + Convert.ToInt32(txtcantmg.Text.Trim())/1000;
            }
            int alto = 610, ancho = 464;
            DateTime ahora = DateTime.Now;
            if (fuopruebacampo.PostedFile != null && fuopruebacampo.PostedFile.FileName != "" && fuopesaje.PostedFile != null && fuopesaje.PostedFile.FileName != "")
            {
                string strExtension = System.IO.Path.GetExtension(fuopruebacampo.FileName);
                string strExtension2 = System.IO.Path.GetExtension(fuopesaje.FileName);
                if ((strExtension.ToUpper() == ".JPG") | (strExtension.ToUpper() == ".JPEG") | (strExtension2.ToUpper() == ".JPG") | (strExtension2.ToUpper() == ".JPEG"))
                {
                    System.Drawing.Image imageToBeResized = System.Drawing.Image.FromStream(fuopruebacampo.PostedFile.InputStream);
                    int imageHeight = imageToBeResized.Height;
                    int imageWidth = imageToBeResized.Width;
                    int maxHeight = alto;
                    int maxWidth = ancho;
                    imageHeight = (imageHeight * maxWidth) / imageWidth;
                    imageWidth = maxWidth;
                    if (imageHeight > maxHeight)
                    {
                        imageWidth = (imageWidth * maxHeight) / imageHeight;
                        imageHeight = maxHeight;
                    }
                    Bitmap bitmap = new Bitmap(imageToBeResized, imageWidth, imageHeight);
                    System.IO.MemoryStream stream = new MemoryStream();
                    bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Jpeg);
                    stream.Position = 0;
                    byte[] image = new byte[stream.Length + 1];
                    stream.Read(image, 0, image.Length);

                    System.Drawing.Image imageToBeResized2 = System.Drawing.Image.FromStream(fuopesaje.PostedFile.InputStream);
                    int imageHeight2 = imageToBeResized2.Height;
                    int imageWidth2 = imageToBeResized2.Width;
                    int maxHeight2 = alto;
                    int maxWidth2 = ancho;
                    imageHeight2 = (imageHeight2 * maxWidth2) / imageWidth2;
                    imageWidth2 = maxWidth2;
                    if (imageHeight2 > maxHeight2)
                    {
                        imageWidth2 = (imageWidth2 * maxHeight2) / imageHeight2;
                        imageHeight2 = maxHeight2;
                    }
                    Bitmap bitmap2 = new Bitmap(imageToBeResized2, imageWidth2, imageHeight2);
                    System.IO.MemoryStream stream2 = new MemoryStream();
                    bitmap2.Save(stream2, System.Drawing.Imaging.ImageFormat.Jpeg);
                    stream2.Position = 0;
                    byte[] image2 = new byte[stream2.Length + 1];
                    stream2.Read(image2, 0, image2.Length);

                    SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandText = "INSERT INTO DROGAS(Op_Id, EstDg_Id, Dg_Cantidad, Capsulas, Formas_Id, Pa_Id, D_Pa_Id, Prueba, Pesaje, fechahoraing, Usuario) VALUES ( @Op_Id, @EstDg_Id, @Dg_Cantidad, @Capsulas, @Formas_Id, @Pa_Id, @D_Pa_Id, @Prueba, @Pesaje, @fechahoraing, @Usuario)";
                    cmd.CommandType = CommandType.Text;
                    cmd.Connection = con;
                    SqlParameter Op_Id = new SqlParameter("@Op_Id", SqlDbType.Int);
                    Op_Id.Value = Convert.ToInt32(lblidop.Text.Trim());
                    cmd.Parameters.Add(Op_Id);
                    SqlParameter EstDg_Id = new SqlParameter("@EstDg_Id", SqlDbType.Int);
                    EstDg_Id.Value = Convert.ToInt32(cboestadodroga.SelectedValue);
                    cmd.Parameters.Add(EstDg_Id);
                    if (cboestadodroga.SelectedValue.Trim() == "5")
                    {
                        SqlParameter Dg_Cantidad = new SqlParameter("@Dg_Cantidad", SqlDbType.Float);
                        Dg_Cantidad.Value = txtdrliq.Text.Trim();
                        cmd.Parameters.Add(Dg_Cantidad);
                    }
                    else
                    {                        
                        SqlParameter Dg_Cantidad = new SqlParameter("@Dg_Cantidad", SqlDbType.Float);
                        Dg_Cantidad.Value = sumadroga;
                        cmd.Parameters.Add(Dg_Cantidad);
                    }
                    
                    if (txtcantunid.Text.Trim() == "")
                    {
                        SqlParameter Capsulas = new SqlParameter("@Capsulas", SqlDbType.Int);
                        Capsulas.Value = Convert.ToInt32("0");
                        cmd.Parameters.Add(Capsulas);
                    }
                    else
                    {
                        SqlParameter Capsulas = new SqlParameter("@Capsulas", SqlDbType.Int);
                        Capsulas.Value = Convert.ToInt32(txtcantunid.Text.Trim());
                        cmd.Parameters.Add(Capsulas);
                    }
                    SqlParameter Formas_Id = new SqlParameter("@Formas_Id", SqlDbType.Int);
                    Formas_Id.Value = Convert.ToInt32(cboformatran.SelectedValue);
                    cmd.Parameters.Add(Formas_Id);
                    SqlParameter Pa_Id = new SqlParameter("@Pa_Id", SqlDbType.Int);
                    Pa_Id.Value = Convert.ToInt32(cboproceden.SelectedValue);
                    cmd.Parameters.Add(Pa_Id);
                    SqlParameter D_Pa_Id = new SqlParameter("@D_Pa_Id", SqlDbType.Int);
                    D_Pa_Id.Value = Convert.ToInt32(cbodestino.SelectedValue);
                    cmd.Parameters.Add(D_Pa_Id);
                    SqlParameter Prueba = new SqlParameter("@Prueba", SqlDbType.Image, image.Length);
                    Prueba.Value = image;
                    cmd.Parameters.Add(Prueba);
                    SqlParameter Pesaje = new SqlParameter("@Pesaje", SqlDbType.Image, image.Length);
                    Pesaje.Value = image2;
                    cmd.Parameters.Add(Pesaje);
                    SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
                    fechahoraing.Value = ahora;
                    cmd.Parameters.Add(fechahoraing);
                    SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
                    Usuario.Value = usuariolog.Trim();
                    cmd.Parameters.Add(Usuario);
                    con.Open();
                    int result = cmd.ExecuteNonQuery();
                    con.Close();
                    limpiadrogas();
                    MuestraDrogas();
                    muestrapesaje();
                }
            }
        }
    }
    private void muestrapesaje()
    {
        String CadenaConsultapes = "SELECT DROGAS.Dg_Id AS PES1, TIPOSDROGA.Descripcion AS PES2 " +
                                 "FROM DROGAS INNER JOIN ESTADODROGA ON DROGAS.EstDg_Id = ESTADODROGA.EstDg_Id INNER JOIN TIPOSDROGA ON ESTADODROGA.Td_Id = TIPOSDROGA.Td_Id INNER JOIN OPERATIVO ON DROGAS.Op_Id = OPERATIVO.Op_Id " +
                                 "WHERE (OPERATIVO.Op_Id = " + Convert.ToInt32(lblidop.Text.Trim()) + ")";
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter(CadenaConsultapes, con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridPesaje.DataSource = ds;
        GridPesaje.DataBind();
        con.Close();
    }
    //* Sustancias Quimicas Controladas solidas* //
    private void TipoSusSolidas()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Ssd_Id, Ssd_Descripcion FROM SUSSOLDESC";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbosussol.ClearSelection();
        cbosussol.Items.Clear();
        cbosussol.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbosussol.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void limpiaSusSolidas()
    {
        txtcantssk.Text = "";
        txtcantssg.Text = "";
        TipoSusSolidas();
        cbosussol.Focus();
    }
    private void MuestraSusSolidas()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT SUSTANCIASSOL.Ss_Id AS sussol1, SUSSOLDESC.Ssd_Descripcion AS sussol2, SUSTANCIASSOL.Ss_Cantidad AS sussol3 FROM SUSTANCIASSOL INNER JOIN " +
                                                "SUSSOLDESC ON SUSTANCIASSOL.Ssd_Id = SUSSOLDESC.Ssd_Id INNER JOIN OPERATIVO ON SUSTANCIASSOL.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id WHERE (OPERATIVO.Op_Id = " + Convert.ToInt32(lblidop.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridView2.DataSource = ds;
        GridView2.DataBind();
    }
    protected void GridView2_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        string id = GridView2.Rows[e.RowIndex].Cells[0].Text;
        deletesussol(id);
        MuestraSusSolidas();
    }
    private void deletesussol(string codigo)
    {
        string sql = "Delete SUSTANCIASSOL Where Ss_Id =" + codigo;
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXSIII);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
    }
    protected void btnsussol_Click(object sender, EventArgs e)
    {
        if (cbosussol.SelectedItem.Text.Trim() == "Seleccione un Dato" && txtcantssk.Text.Trim() == "" && txtcantssg.Text.Trim() == "")
        {
            txtcantssk.Focus();
        }
        else
        { 
            float sumasol = 0;
            if (txtcantssk.Text.Trim() != "")
            {
                float kilos = Convert.ToInt32(txtcantssk.Text.Trim());
                sumasol = sumasol + kilos;
            }
            else
            {
                sumasol = sumasol + 0;
            }
            if (txtcantssg.Text.Trim() != "")
            {
                float gramos = Convert.ToInt32(txtcantssg.Text.Trim());
                sumasol = sumasol + gramos / 1000;
            }
            else
            {
                sumasol = sumasol + 0;
            }
            DateTime ahora = DateTime.Now;
            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            SqlCommand cmd = new SqlCommand();
            cmd.CommandText = "INSERT INTO SUSTANCIASSOL(Op_Id, Ssd_Id, Ss_Cantidad, fechahoraing, Usuario) VALUES (@Op_Id, @Ssd_Id, @Ss_Cantidad, @fechahoraing, @Usuario)";
            cmd.CommandType = CommandType.Text;
            cmd.Connection = con;
            SqlParameter Op_Id = new SqlParameter("@Op_Id", SqlDbType.Int);
            Op_Id.Value = Convert.ToInt32(lblidop.Text.Trim());
            cmd.Parameters.Add(Op_Id);
            SqlParameter Ssd_Id = new SqlParameter("@Ssd_Id", SqlDbType.Int);
            Ssd_Id.Value = Convert.ToInt32(cbosussol.SelectedValue);
            cmd.Parameters.Add(Ssd_Id);
            SqlParameter Ss_Cantidad = new SqlParameter("@Ss_Cantidad", SqlDbType.Float);
            Ss_Cantidad.Value = sumasol;
            cmd.Parameters.Add(Ss_Cantidad);
            SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
            fechahoraing.Value = ahora;
            cmd.Parameters.Add(fechahoraing);
            SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
            Usuario.Value = usuariolog.Trim();
            cmd.Parameters.Add(Usuario);
            con.Open();
            int result = cmd.ExecuteNonQuery();
            con.Close();
            limpiaSusSolidas();
            MuestraSusSolidas();
        }
    }
    //* Sustancias Quimicas Controladas liquidas* //
    private void TipoSusliquidas()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Sld_Id, Sld_Descripcion FROM SUSLIQDESC";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbosusliq.ClearSelection();
        cbosusliq.Items.Clear();
        cbosusliq.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbosusliq.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void limpiaSusLiquidas()
    {
        txtcantsll.Text = "";
        txtcantslm.Text = "";
        TipoSusliquidas();
        MuestraSusliquidas();
        cbosusliq.Focus();
    }
    private void MuestraSusliquidas()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT SUSTANCIALIQ.Sl_Id AS susliq1, SUSLIQDESC.Sld_Descripcion AS susliq2, SUSTANCIALIQ.Sl_Cantidad AS susliq3 FROM SUSTANCIALIQ INNER JOIN " +
                                                "SUSLIQDESC ON SUSTANCIALIQ.Sld_Id = SUSLIQDESC.Sld_Id INNER JOIN OPERATIVO ON SUSTANCIALIQ.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id WHERE (OPERATIVO.Op_Id = " + Convert.ToInt32(lblidop.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridView3.DataSource = ds;
        GridView3.DataBind();
        con.Close();
    }
    protected void GridView3_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        string id = GridView3.Rows[e.RowIndex].Cells[0].Text;
        deletesusliq(id);
        MuestraSusSolidas();
    }
    private void deletesusliq(string codigo)
    {
        string sql = "Delete SUSTANCIALIQ Where Sl_Id = " + codigo;
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXSIII);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
        MuestraSusliquidas();
    }
    protected void btnsusliq_Click(object sender, EventArgs e)
    {
        if (cbosusliq.SelectedItem.Text.Trim() == "Seleccione un Dato" && txtcantsll.Text.Trim() == "" && txtcantslm.Text.Trim() == "")
        {
            txtcantsll.Focus();
        }
        else
        {               
            float sumasol = 0;
            if (txtcantsll.Text.Trim() != "")
            {
                float litros = Convert.ToInt32(txtcantsll.Text.Trim());
                sumasol = sumasol + litros;
            }
            else
            {
                sumasol = sumasol + 0;
            }
            if (txtcantslm.Text.Trim() != "")
            {
                float mililit = Convert.ToInt32(txtcantslm.Text.Trim());
                sumasol = sumasol + mililit / 1000;
            }
            else
            {
                sumasol = sumasol + 0;
            }
            DateTime ahora = DateTime.Now;
            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            SqlCommand cmd = new SqlCommand();
            cmd.CommandText = "INSERT INTO SUSTANCIALIQ (Op_Id, Sld_Id, Sl_Cantidad, fechahoraing, Usuario) VALUES ( @Op_Id, @Sld_Id, @Sl_Cantidad, @fechahoraing, @Usuario)";
            cmd.CommandType = CommandType.Text;
            cmd.Connection = con;
            SqlParameter Op_Id = new SqlParameter("@Op_Id", SqlDbType.Int);
            Op_Id.Value = Convert.ToInt32(lblidop.Text.Trim());
            cmd.Parameters.Add(Op_Id);
            SqlParameter Sld_Id = new SqlParameter("@Sld_Id", SqlDbType.Int);
            Sld_Id.Value = Convert.ToInt32(cbosusliq.SelectedValue);
            cmd.Parameters.Add(Sld_Id);
            SqlParameter Sl_Cantidad = new SqlParameter("@Sl_Cantidad", SqlDbType.Float);
            Sl_Cantidad.Value = sumasol;
            cmd.Parameters.Add(Sl_Cantidad);
            SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
            fechahoraing.Value = ahora;
            cmd.Parameters.Add(fechahoraing);
            SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
            Usuario.Value = usuariolog.Trim();
            cmd.Parameters.Add(Usuario);
            con.Open();
            int result = cmd.ExecuteNonQuery();
            con.Close();
            limpiaSusLiquidas();
            MuestraSusliquidas();
        }
    }
    /*fabricas pozas*/
    private void Tipofabricas()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Tf_Id, Descripcion FROM TIPOFABRICA";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbotipofl.ClearSelection();
        cbotipofl.Items.Clear();
        cbocaracfl.ClearSelection();
        cbocaracfl.Items.Clear();
        cbotipofl.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbotipofl.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void cbotipofl_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT FABRICAMODELOS.FabMod_id, FABRICAMODELOS.Descripcion FROM TIPOFABRICA INNER JOIN FABRICAMODELOS ON TIPOFABRICA.Tf_Id = FABRICAMODELOS.Tf_Id WHERE (TIPOFABRICA.Tf_Id = " + Convert.ToInt32(cbotipofl.SelectedValue) + ")";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbocaracfl.ClearSelection();
        cbocaracfl.Items.Clear();
        cbocaracfl.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbocaracfl.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
        cbocaracfl.Focus();
    }
    private void limpiafabrica()
    {
        txtcantfl.Text = "";
        Tipofabricas();
        cbotipofl.Focus();
    }
    private void Muestrafabrica()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT FABRICAS.Fa_Id AS fab1, TIPOFABRICA.Descripcion AS fab2, FABRICAMODELOS.Descripcion AS fab3, FABRICAS.Cantidad AS fab4 FROM FABRICAS INNER JOIN " +
                                                "FABRICAMODELOS ON FABRICAS.FabMod_id = FABRICAMODELOS.FabMod_id INNER JOIN TIPOFABRICA ON FABRICAMODELOS.Tf_Id = TIPOFABRICA.Tf_Id INNER JOIN OPERATIVO ON FABRICAS.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id " +
                                                "WHERE (OPERATIVO.Op_Id = " + Convert.ToInt32(lblidop.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridView5.DataSource = ds;
        GridView5.DataBind();
    }
    protected void GridView5_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        string id = GridView5.Rows[e.RowIndex].Cells[0].Text;
        deletefabrica(id);
        Muestrafabrica();
    }
    private void deletefabrica(string codigo)
    {
        string sql = "Delete FABRICAS Where Fa_Id =" + codigo;
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXSIII);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
    }
    protected void btntipofl_Click(object sender, EventArgs e)
    {
        if (cbotipofl.SelectedItem.Text.Trim() != "Seleccione un Dato" && cbocaracfl != null && txtcantfl.Text.Trim() != "")
        {
            if (cbotipofl.SelectedItem.Text.Trim() != "Seleccione un Dato")
            {
                DateTime ahora = DateTime.Now;
                SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
                SqlCommand cmd = new SqlCommand();
                cmd.CommandText = "INSERT INTO FABRICAS (Op_Id, FabMod_id, Cantidad, fechahoraing, Usuario) VALUES (@Op_Id, @FabMod_id, @Cantidad, @fechahoraing, @Usuario)";
                cmd.CommandType = CommandType.Text;
                cmd.Connection = con;
                SqlParameter Op_Id = new SqlParameter("@Op_Id", SqlDbType.Int);
                Op_Id.Value = Convert.ToInt32(lblidop.Text.Trim());
                cmd.Parameters.Add(Op_Id);
                SqlParameter FabMod_id = new SqlParameter("@FabMod_id", SqlDbType.Int);
                FabMod_id.Value = Convert.ToInt32(cbocaracfl.SelectedValue);
                cmd.Parameters.Add(FabMod_id);
                SqlParameter Cantidad = new SqlParameter("@Cantidad", SqlDbType.Int);
                Cantidad.Value = Convert.ToInt32(txtcantfl.Text.Trim());
                cmd.Parameters.Add(Cantidad);
                SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
                fechahoraing.Value = ahora;
                cmd.Parameters.Add(fechahoraing);
                SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
                Usuario.Value = usuariolog.Trim();
                cmd.Parameters.Add(Usuario);
                con.Open();
                int result = cmd.ExecuteNonQuery();
                con.Close();
                limpiafabrica();
                Muestrafabrica();
            }
            else
            {
                cbotipofl.Focus();
            }
        }
        else 
        {
            cbotipofl.Focus();
        }
    }
    /*Bienes Secuestrados*/
    protected void Button2_Click(object sender, EventArgs e)
    {
        Page.Validate("personas");
        if (Page.IsValid)
        {
            DateTime ahora = DateTime.Now;
            string strExtension = System.IO.Path.GetExtension(fupff.FileName);
            string strExtension2 = System.IO.Path.GetExtension(fuppi.FileName);
            string strExtension3 = System.IO.Path.GetExtension(fuppd.FileName);

            if ((strExtension.ToUpper() == ".JPG") | (strExtension.ToUpper() == ".JPEG") | (strExtension2.ToUpper() == ".JPG") | (strExtension2.ToUpper() == ".JPEG") | (strExtension3.ToUpper() == ".JPG") | (strExtension3.ToUpper() == ".JPEG"))
            {
                System.Drawing.Image imageToBeResized = System.Drawing.Image.FromStream(fupff.PostedFile.InputStream);
                int imageHeight = imageToBeResized.Height;
                int imageWidth = imageToBeResized.Width;
                int maxHeight = 444;
                int maxWidth = 377;
                imageHeight = (imageHeight * maxWidth) / imageWidth;
                imageWidth = maxWidth;
                if (imageHeight > maxHeight)
                {
                    imageWidth = (imageWidth * maxHeight) / imageHeight;
                    imageHeight = maxHeight;
                }
                Bitmap bitmap = new Bitmap(imageToBeResized, imageWidth, imageHeight);
                System.IO.MemoryStream stream = new MemoryStream();
                bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Jpeg);
                stream.Position = 0;
                byte[] image = new byte[stream.Length + 1];
                stream.Read(image, 0, image.Length);

                System.Drawing.Image imageToBeResized2 = System.Drawing.Image.FromStream(fuppi.PostedFile.InputStream);
                int imageHeight2 = imageToBeResized2.Height;
                int imageWidth2 = imageToBeResized2.Width;
                int maxHeight2 = 444;
                int maxWidth2 = 377;
                imageHeight2 = (imageHeight2 * maxWidth2) / imageWidth2;
                imageWidth2 = maxWidth2;
                if (imageHeight2 > maxHeight2)
                {
                    imageWidth2 = (imageWidth2 * maxHeight2) / imageHeight2;
                    imageHeight2 = maxHeight2;
                }
                Bitmap bitmap2 = new Bitmap(imageToBeResized2, imageWidth2, imageHeight2);
                System.IO.MemoryStream stream2 = new MemoryStream();
                bitmap2.Save(stream2, System.Drawing.Imaging.ImageFormat.Jpeg);
                stream2.Position = 0;
                byte[] image2 = new byte[stream2.Length + 1];
                stream2.Read(image2, 0, image2.Length);

                System.Drawing.Image imageToBeResized3 = System.Drawing.Image.FromStream(fuppd.PostedFile.InputStream);
                int imageHeight3 = imageToBeResized3.Height;
                int imageWidth3 = imageToBeResized3.Width;
                int maxHeight3 = 266;
                int maxWidth3 = 554;
                imageHeight3 = (imageHeight3 * maxWidth3) / imageWidth3;
                imageWidth3 = maxWidth3;
                if (imageHeight3 > maxHeight3)
                {
                    imageWidth3 = (imageWidth3 * maxHeight3) / imageHeight3;
                    imageHeight3 = maxHeight3;
                }
                Bitmap bitmap3 = new Bitmap(imageToBeResized3, imageWidth3, imageHeight3);
                System.IO.MemoryStream stream3 = new MemoryStream();
                bitmap3.Save(stream3, System.Drawing.Imaging.ImageFormat.Jpeg);
                stream3.Position = 0;
                byte[] image3 = new byte[stream3.Length + 1];
                stream3.Read(image3, 0, image3.Length);

                SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
                SqlCommand cmd = new SqlCommand();
                cmd.CommandText = "INSERT INTO PERSONASAUX(Op_Id, De_Nombres, De_Paterno, De_Materno, De_Esposo, Pa_Id, Genero, Td_Id, NroDoc, De_Fechanac, Direccion, Estado, FotoFrente, FotoPerfilD, FotoPerfilI) VALUES (@Op_Id, @De_Nombres, @De_Paterno, @De_Materno, @De_Esposo, @Pa_Id, @Genero, @Td_Id, @NroDoc, @De_Fechanac, @Direccion, @Estado, @FotoFrente, @FotoPerfilD, @FotoPerfilI)";
                cmd.CommandType = CommandType.Text;
                cmd.Connection = con;
                SqlParameter Op_Id = new SqlParameter("@Op_Id", SqlDbType.Int);
                Op_Id.Value = Convert.ToInt32(lblidop.Text.Trim());
                cmd.Parameters.Add(Op_Id);
                SqlParameter De_Nombres = new SqlParameter("@De_Nombres", SqlDbType.VarChar, 50);
                De_Nombres.Value = TextBox1.Text.Trim().ToUpper();
                cmd.Parameters.Add(De_Nombres);
                SqlParameter De_Paterno = new SqlParameter("@De_Paterno", SqlDbType.VarChar, 50);
                De_Paterno.Value = TextBox2.Text.Trim().ToUpper();
                cmd.Parameters.Add(De_Paterno);
                if (TextBox3.Text.Trim() == "")
                {
                    SqlParameter De_Materno = new SqlParameter("@De_Materno", SqlDbType.VarChar, 50);
                    De_Materno.Value = "*";
                    cmd.Parameters.Add(De_Materno);
                }
                else
                {
                    SqlParameter De_Materno = new SqlParameter("@De_Materno", SqlDbType.VarChar, 50);
                    De_Materno.Value = TextBox3.Text.Trim().ToUpper();
                    cmd.Parameters.Add(De_Materno);
                }
                if (TextBox4.Text.Trim() == "")
                {
                    SqlParameter De_Esposo = new SqlParameter("@De_Esposo", SqlDbType.VarChar, 50);
                    De_Esposo.Value = "*";
                    cmd.Parameters.Add(De_Esposo);
                }
                else
                {
                    SqlParameter De_Esposo = new SqlParameter("@De_Esposo", SqlDbType.VarChar, 50);
                    De_Esposo.Value = TextBox4.Text.Trim().ToUpper();
                    cmd.Parameters.Add(De_Esposo);
                }
                SqlParameter Pa_Id = new SqlParameter("@Pa_Id", SqlDbType.Int);
                Pa_Id.Value = Convert.ToInt32(CboNacionalidad.SelectedValue);
                cmd.Parameters.Add(Pa_Id);
                SqlParameter Genero = new SqlParameter("@Genero", SqlDbType.Int);
                Genero.Value = cbogenero.SelectedValue.Trim();
                cmd.Parameters.Add(Genero);
                SqlParameter Td_Id = new SqlParameter("@Td_Id", SqlDbType.Int);
                Td_Id.Value = Convert.ToInt32(cbotipodoc.SelectedValue);
                cmd.Parameters.Add(Td_Id);
                if (TextBox7.Text.Trim() == "")
                {
                    SqlParameter NroDoc = new SqlParameter("@NroDoc", SqlDbType.VarChar, 50);
                    NroDoc.Value = "SN";
                    cmd.Parameters.Add(NroDoc);
                }
                else
                {
                    SqlParameter NroDoc = new SqlParameter("@NroDoc", SqlDbType.VarChar, 50);
                    NroDoc.Value = TextBox7.Text.Trim().ToUpper();
                    cmd.Parameters.Add(NroDoc);
                }
                if (TextBox5.Text.Trim() == "")
                {
                    SqlParameter De_Fechanac = new SqlParameter("@De_Fechanac", SqlDbType.DateTime);
                    De_Fechanac.Value = System.Data.SqlTypes.SqlDateTime.Null;
                    cmd.Parameters.Add(De_Fechanac);
                }
                else
                {
                    DateTime dateTime1;
                    dateTime1 = DateTime.Parse(TextBox5.Text.Trim());
                    SqlParameter De_Fechanac = new SqlParameter("@De_Fechanac", SqlDbType.DateTime);
                    De_Fechanac.Value = dateTime1;
                    cmd.Parameters.Add(De_Fechanac);
                }
                SqlParameter Direccion = new SqlParameter("@Direccion", SqlDbType.NVarChar, 255);
                Direccion.Value = TextBox6.Text.Trim().ToUpper();
                cmd.Parameters.Add(Direccion);
                SqlParameter Estado = new SqlParameter("@Estado", SqlDbType.NVarChar, 35);
                Estado.Value = ddlestado.SelectedItem.ToString().Trim();
                cmd.Parameters.Add(Estado);
                SqlParameter FotoFrente = new SqlParameter("@FotoFrente", SqlDbType.Image, image.Length);
                FotoFrente.Value = image;
                cmd.Parameters.Add(FotoFrente);
                SqlParameter FotoPerfilD = new SqlParameter("@FotoPerfilD", SqlDbType.Image, image2.Length);
                FotoPerfilD.Value = image2;
                cmd.Parameters.Add(FotoPerfilD);
                SqlParameter FotoPerfilI = new SqlParameter("@FotoPerfilI", SqlDbType.Image, image3.Length);
                FotoPerfilI.Value = image3;
                cmd.Parameters.Add(FotoPerfilI);
                con.Open();
                int result = cmd.ExecuteNonQuery();
                con.Close();
                limpiadet();
                muestradet();
            }
        }
    }
    private void muestradet()
    {
        String CadenaConsulta2 = "SELECT PERSONASAUX.Peraux_Id AS Det1, RTRIM(PERSONASAUX.De_Nombres) + ' ' + RTRIM(PERSONASAUX.De_Paterno) + ' ' + RTRIM(PERSONASAUX.De_Materno) + ' ' + RTRIM(PERSONASAUX.De_Esposo) AS Det2, PAIS.Descripcion AS Det3, (CASE WHEN(PERSONASAUX.Genero = 1) THEN 'Masculino' ELSE 'Femenino' END) AS Det4, TIPODOC.Descripcion AS Det5, PERSONASAUX.NroDoc AS Det6, (CASE WHEN(De_Fechanac IS NULL) THEN '*' ELSE(CONVERT(char(10), De_Fechanac, 103)) END) AS Det7, PERSONASAUX.Direccion AS Det8, PERSONASAUX.Estado AS Det9 " +
                                 "FROM PERSONASAUX INNER JOIN PAIS ON PERSONASAUX.Pa_Id = PAIS.Pa_Id INNER JOIN TIPODOC ON PERSONASAUX.Td_Id = TIPODOC.Td_Id " +
                                 "WHERE (PERSONASAUX.Op_Id = " + Convert.ToInt32(lblidop.Text.Trim()) + ")";
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter(CadenaConsulta2, con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridView6.DataSource = ds;
        GridView6.DataBind();
        con.Close();
    }
    protected void GridView6_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        string id = GridView6.Rows[e.RowIndex].Cells[0].Text;
        deletepersonas(id);
        muestradet();
        TextBox1.Focus();
    }
    private void deletepersonas(string codigo)
    {
        string sql = "Delete PERSONASAUX Where Peraux_Id =" + codigo;
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXSIII);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
    }
    private void limpiadet()
    {
        TextBox1.Text="";
        TextBox2.Text = "";
        TextBox3.Text = "";
        TextBox4.Text = "";
        Pais_Detenido();
        cbogenero.SelectedValue = "1";
        cbotipodoc.SelectedValue = "12";
        TextBox7.Text = "";
        TextBox5.Text = "";
        TextBox6.Text = "";
        fupff.Attributes.Clear();
        fupff.Dispose(); 
        fuppi.Attributes.Clear();
        fuppi.Dispose();
        fuppd.Attributes.Clear();
        fuppd.Dispose();
        TextBox1.Focus();
    }
    private void Pais_Detenido()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Pa_Id, Descripcion FROM PAIS ORDER BY Descripcion";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        CboNacionalidad.ClearSelection();
        CboNacionalidad.Items.Clear();
        CboNacionalidad.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            CboNacionalidad.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
        string indice = "70";
        CboNacionalidad.SelectedIndex = CboNacionalidad.Items.IndexOf(CboNacionalidad.Items.FindByValue(indice));
    }
    /*Bienes Secuestrados*/
    private void Bienes()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Bien_Id, Descripcion FROM BIENES";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbobien.ClearSelection();
        cbobien.Items.Clear();
        cboclase.ClearSelection();
        cbotipo.Items.Clear();
        cbotipo.ClearSelection();
        cboclase.Items.Clear();
        cbobien.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbobien.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void cbobien_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT CatClas_Id, Descripcion FROM CATALOGOCLASE WHERE (Bien_Id = " + Convert.ToInt32(cbobien.SelectedValue.Trim()) + ") ORDER BY Descripcion";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cboclase.ClearSelection();
        cboclase.Items.Clear();
        cbotipo.ClearSelection();
        cbotipo.Items.Clear();
        cboclase.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cboclase.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
        cboclase.Focus();
    }
    protected void cboclase_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT CatTipo_Id, Descripcion FROM CATALOGOTIPO WHERE (CatClas_Id = " + Convert.ToInt32(cboclase.SelectedValue) + ") ORDER BY Descripcion";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cbotipo.ClearSelection();
        cbotipo.Items.Clear();
        cbotipo.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cbotipo.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
        cbotipo.Focus();
    }
    private void limpiadebienes()
    {
        txtcantbien.Text = "";
        Bienes();
        cbobien.Focus();
    }
    private void Muestrabienes()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT ITEMBIENSECUESTRADO.ItemBienSec_Id AS bien1, BIENES.Descripcion AS bien2, CATALOGOCLASE.Descripcion AS bien3, CATALOGOTIPO.Descripcion AS bien4, ITEMBIENSECUESTRADO.CantidadBien AS bien5, (CASE WHEN (ITEMBIENSECUESTRADO.Inves = 1) THEN 'SI' ELSE 'NO' END) AS bien6 " +
                                                "FROM ITEMBIENSECUESTRADO INNER JOIN CATALOGOTIPO ON ITEMBIENSECUESTRADO.CatTipo_Id = CATALOGOTIPO.CatTipo_Id INNER JOIN CATALOGOCLASE ON CATALOGOTIPO.CatClas_Id = CATALOGOCLASE.CatClas_Id INNER JOIN BIENES ON CATALOGOCLASE.Bien_Id = BIENES.Bien_Id INNER JOIN OPERATIVO ON ITEMBIENSECUESTRADO.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id " +
                                                "WHERE (OPERATIVO.Op_Id = " + Convert.ToInt32(lblidop.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridView7.DataSource = ds;
        GridView7.DataBind();
    }
    protected void GridView7_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        string id = GridView7.Rows[e.RowIndex].Cells[0].Text;
        deletecaract(id);
        deletebienes(id);
        Muestrabienes();
    }
    private void deletecaract(string codigo2)
    {
        string sql = "Delete ITEMBIENCARACTERISTICAS Where ItemBienSec_Id =" + codigo2.ToString().Trim();
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXSIII);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
    }
    protected void GridView7_SelectedIndexChanged(object sender, EventArgs e)
    {
        GridViewRow row = GridView7.SelectedRow;
        LblIdcatalogo.Text = row.Cells[0].Text;
        Muestracaracteristica(LblIdcatalogo.Text.Trim());
        muestracombocarac(LblIdcatalogo.Text.Trim());
        txtcaracteristica.Text = "";
        cbocaracteristica.Focus();
    }
    private void muestracombocarac(string idcodv)
    {
        if (idcodv.Trim() != "")
        {
            DataTable dt = new DataTable();
            SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
            SqlConn.Open();
            string sql = "SELECT CATALOGOCARACTERISTICAS.CatCarac_Id, CATALOGOCARACTERISTICAS.Descripcion FROM CATALOGOCLASE INNER JOIN CATALOGOCARACTERISTICAS ON CATALOGOCLASE.CatClas_Id = CATALOGOCARACTERISTICAS.CatClas_Id INNER JOIN CATALOGOTIPO ON CATALOGOCLASE.CatClas_Id = CATALOGOTIPO.CatClas_Id INNER JOIN ITEMBIENSECUESTRADO ON CATALOGOTIPO.CatTipo_Id = ITEMBIENSECUESTRADO.CatTipo_Id WHERE(ITEMBIENSECUESTRADO.ItemBienSec_Id = " + Convert.ToInt32(idcodv.ToString().Trim()) + ")";
            SqlCommand cmd = new SqlCommand(sql);
            cmd.CommandType = CommandType.Text;
            cmd.Connection = SqlConn;
            SqlDataAdapter sd = new SqlDataAdapter(cmd);
            cbocaracteristica.ClearSelection();
            cbocaracteristica.Items.Clear();
            cbocaracteristica.Items.Add("Seleccione un Dato");
            sd.Fill(dt);
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                cbocaracteristica.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
            }
            SqlConn.Close();
        }
    }
    private void Muestracaracteristica(string idcod)
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT ITEMBIENCARACTERISTICAS.ItemBienCar_Id AS carac1, CATALOGOCARACTERISTICAS.Descripcion AS carac2, ITEMBIENCARACTERISTICAS.Descripcion AS carac3 FROM ITEMBIENCARACTERISTICAS INNER JOIN CATALOGOCARACTERISTICAS ON ITEMBIENCARACTERISTICAS.CatCarac_Id = CATALOGOCARACTERISTICAS.CatCarac_Id WHERE(ITEMBIENCARACTERISTICAS.ItemBienSec_Id = " + Convert.ToInt32(idcod.ToString().Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridView8.DataSource = ds;
        GridView8.DataBind();
        con.Close();
    }
    private void deletebienes(string codigo1)
    {
        string sql = "Delete ITEMBIENSECUESTRADO Where ItemBienSec_Id =" + codigo1.ToString().Trim();
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXSIII);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
    }
    protected void btnaddbien_Click(object sender, EventArgs e)
    {
        DateTime ahora = DateTime.Now;
        string strExtension = System.IO.Path.GetExtension(fupbien.FileName);
        if ((strExtension.ToUpper() == ".JPG") | (strExtension.ToUpper() == ".JPEG"))
        {
            System.Drawing.Image imageToBeResized = System.Drawing.Image.FromStream(fupbien.PostedFile.InputStream);
            int imageHeight = imageToBeResized.Height;
            int imageWidth = imageToBeResized.Width;
            int maxHeight = 360;
            int maxWidth = 550;
            imageHeight = (imageHeight * maxWidth) / imageWidth;
            imageWidth = maxWidth;
            if (imageHeight > maxHeight)
            {
                imageWidth = (imageWidth * maxHeight) / imageHeight;
                imageHeight = maxHeight;
            }
            Bitmap bitmap = new Bitmap(imageToBeResized, imageWidth, imageHeight);
            System.IO.MemoryStream stream = new MemoryStream();
            bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Jpeg);
            stream.Position = 0;
            byte[] image = new byte[stream.Length + 1];
            stream.Read(image, 0, image.Length);

            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            SqlCommand cmd = new SqlCommand();
            cmd.CommandText = "INSERT INTO ITEMBIENSECUESTRADO(Op_Id, CatTipo_Id, CantidadBien, CostoAprox, CostoCuant, Inves, FotoBien, fechahoraing, Usuario) VALUES (@Op_Id, @CatTipo_Id, @CantidadBien, @CostoAprox, @CostoCuant, @Inves, @FotoBien, @fechahoraing, @Usuario)";
            cmd.CommandType = CommandType.Text;
            cmd.Connection = con;
            SqlParameter Op_Id = new SqlParameter("@Op_Id", SqlDbType.Int);
            Op_Id.Value = Convert.ToInt32(lblidop.Text.Trim());
            cmd.Parameters.Add(Op_Id);
            SqlParameter CatTipo_Id = new SqlParameter("@CatTipo_Id", SqlDbType.Int);
            CatTipo_Id.Value = Convert.ToInt32(cbotipo.SelectedValue);
            cmd.Parameters.Add(CatTipo_Id);
            SqlParameter CantidadBien = new SqlParameter("@CantidadBien", SqlDbType.Int);
            CantidadBien.Value = Convert.ToInt32(txtcantbien.Text.Trim());
            cmd.Parameters.Add(CantidadBien);
            SqlParameter CostoAprox = new SqlParameter("@CostoAprox", SqlDbType.Int);
            CostoAprox.Value = Convert.ToInt32("0");
            cmd.Parameters.Add(CostoAprox);
            SqlParameter CostoCuant = new SqlParameter("@CostoCuant", SqlDbType.Int);
            CostoCuant.Value = Convert.ToInt32("0");
            cmd.Parameters.Add(CostoCuant);
            SqlParameter Inves = new SqlParameter("@Inves", SqlDbType.Int);
            Inves.Value = Convert.ToInt32(cboinvest.SelectedValue);
            cmd.Parameters.Add(Inves);
            SqlParameter FotoBien = new SqlParameter("@FotoBien", SqlDbType.Image, image.Length);
            FotoBien.Value = image;
            cmd.Parameters.Add(FotoBien);
            SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
            fechahoraing.Value = ahora;
            cmd.Parameters.Add(fechahoraing);
            SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
            Usuario.Value = usuariolog.Trim();
            cmd.Parameters.Add(Usuario);
            con.Open();
            int result = cmd.ExecuteNonQuery();
            con.Close();
            limpiadebienes();
            Muestrabienes();
        }
    }
    protected void GridView8_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        string id = GridView8.Rows[e.RowIndex].Cells[0].Text;        
        deletecaract2(id);
        Muestracaracteristica(LblIdcatalogo.Text.Trim());
        MuestrabienesGeneral();
        cbocaracteristica.Focus();
    }
    private void deletecaract2(string codigo3)
    {
        string sql = "Delete ITEMBIENCARACTERISTICAS Where ItemBienCar_Id =" + codigo3.ToString().Trim();
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXSIII);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
    }
    private void Muestrabienes2()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT ITEMBIENSECUESTRADO.ItemBienSec_Id AS bien1, BIENES.Descripcion AS bien2, CATALOGOCLASE.Descripcion AS bien3, CATALOGOTIPO.Descripcion AS bien4, ITEMBIENSECUESTRADO.CantidadBien AS bien5 " +
                                                "FROM ITEMBIENSECUESTRADO INNER JOIN CATALOGOTIPO ON ITEMBIENSECUESTRADO.CatTipo_Id = CATALOGOTIPO.CatTipo_Id INNER JOIN CATALOGOCLASE ON CATALOGOTIPO.CatClas_Id = CATALOGOCLASE.CatClas_Id INNER JOIN BIENES ON CATALOGOCLASE.Bien_Id = BIENES.Bien_Id INNER JOIN OPERATIVO ON ITEMBIENSECUESTRADO.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id " +
                                                "WHERE (OPERATIVO.Op_Id = " + Convert.ToInt32(LblIdcatalogo.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridView8.DataSource = ds;
        GridView8.DataBind();
        con.Close();
    }
    protected void btnactcaract_Click(object sender, EventArgs e)
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO ITEMBIENCARACTERISTICAS(ItemBienSec_Id, CatCarac_Id, Descripcion, fechahoraing, Usuario) VALUES (@ItemBienSec_Id, @CatCarac_Id, @Descripcion, @fechahoraing, @Usuario)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter ItemBienSec_Id = new SqlParameter("@ItemBienSec_Id", SqlDbType.Int);
        ItemBienSec_Id.Value = Convert.ToInt32(LblIdcatalogo.Text.Trim());
        cmd.Parameters.Add(ItemBienSec_Id);
        SqlParameter CatCarac_Id = new SqlParameter("@CatCarac_Id", SqlDbType.Int);
        CatCarac_Id.Value = Convert.ToInt32(cbocaracteristica.SelectedValue);
        cmd.Parameters.Add(CatCarac_Id);
        SqlParameter Descripcion = new SqlParameter("@Descripcion", SqlDbType.VarChar, 50);
        Descripcion.Value = txtcaracteristica.Text.Trim().ToUpper();
        cmd.Parameters.Add(Descripcion);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = usuariolog.Trim();
        cmd.Parameters.Add(Usuario);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
        Muestracaracteristica(LblIdcatalogo.Text.Trim());
        Muestracaracteristica(LblIdcatalogo.Text.Trim());
        muestracombocarac(LblIdcatalogo.Text.Trim());
        MuestrabienesGeneral();
        txtcaracteristica.Text = "";
        txtcaracteristica.Focus();
    }
    private void MuestrabienesGeneral()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT ITEMBIENSECUESTRADO.ItemBienSec_Id AS bien1, BIENES.Descripcion AS bien2, CATALOGOCLASE.Descripcion AS bien3, CATALOGOTIPO.Descripcion AS bien4, ITEMBIENSECUESTRADO.CantidadBien AS bien5 " +
                                                "FROM ITEMBIENSECUESTRADO INNER JOIN CATALOGOTIPO ON ITEMBIENSECUESTRADO.CatTipo_Id = CATALOGOTIPO.CatTipo_Id INNER JOIN CATALOGOCLASE ON CATALOGOTIPO.CatClas_Id = CATALOGOCLASE.CatClas_Id INNER JOIN BIENES ON CATALOGOCLASE.Bien_Id = BIENES.Bien_Id INNER JOIN OPERATIVO ON ITEMBIENSECUESTRADO.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id " +
                                                "WHERE (OPERATIVO.Op_Id = " + Convert.ToInt32(lblidop.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridBienes.DataSource = ds;
        GridBienes.DataBind();
        con.Close();
    }
    protected void GridBienes_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            string Idbienes = GridBienes.DataKeys[e.Row.RowIndex].Value.ToString();
            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            con.Open();
            SqlDataAdapter cmd1 = new SqlDataAdapter("SELECT ITEMBIENCARACTERISTICAS.ItemBienCar_Id AS carac1, CATALOGOCARACTERISTICAS.Descripcion AS carac2, ITEMBIENCARACTERISTICAS.Descripcion AS carac3 FROM CATALOGOCARACTERISTICAS INNER JOIN ITEMBIENCARACTERISTICAS ON CATALOGOCARACTERISTICAS.CatCarac_Id = ITEMBIENCARACTERISTICAS.CatCarac_Id WHERE (ITEMBIENCARACTERISTICAS.ItemBienSec_Id =" + Convert.ToInt32(Idbienes.Trim()) + ")", con);
            DataSet ds1 = new DataSet();
            GridView gvcarac = e.Row.FindControl("GridSubBienes") as GridView;
            cmd1.Fill(ds1);
            gvcarac.DataSource = ds1;
            gvcarac.DataBind();
            con.Close();
        }
    }

    protected void btnlogo_Click(object sender, EventArgs e)
    {
        Page.Validate("logo");
        if (Page.IsValid)
        {
            int alto = 1200, ancho = 1600;
            DateTime ahora = DateTime.Now;
            if (fuimagen.PostedFile != null && fuimagen.PostedFile.FileName != "")
            {
                string strExtension = System.IO.Path.GetExtension(fuimagen.FileName);
                if ((strExtension.ToUpper() == ".JPG") | (strExtension.ToUpper() == ".JPEG"))
                {
                    System.Drawing.Image imageToBeResized = System.Drawing.Image.FromStream(fuimagen.PostedFile.InputStream);
                    int imageHeight = imageToBeResized.Height;
                    int imageWidth = imageToBeResized.Width;
                    int maxHeight = alto;
                    int maxWidth = ancho;
                    imageHeight = (imageHeight * maxWidth) / imageWidth;
                    imageWidth = maxWidth;
                    if (imageHeight > maxHeight)
                    {
                        imageWidth = (imageWidth * maxHeight) / imageHeight;
                        imageHeight = maxHeight;
                    }
                    Bitmap bitmap = new Bitmap(imageToBeResized, imageWidth, imageHeight);
                    System.IO.MemoryStream stream = new MemoryStream();
                    bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Jpeg);
                    stream.Position = 0;
                    byte[] image = new byte[stream.Length + 1];
                    stream.Read(image, 0, image.Length);

                    SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandText = "INSERT INTO LOGOTIPOS(Op_Id, NroCaso, NroOperativo, Op_FechaOperativo, NombreCaso, Op_Descripcion, Imagen, Descrip_Logo, Td_Id, PaO_Id, PaD_Id, Organizacion, Blanco, Observacion, Enlace, Fotografia, fechahoraing, Usuario) VALUES (@Op_Id, @NroCaso, @NroOperativo, @Op_FechaOperativo, @NombreCaso, @Op_Descripcion, @Imagen, @Descrip_Logo, @Td_Id, @PaO_Id, @PaD_Id, @Organizacion, @Blanco, @Observacion, @Enlace, @Fotografia, @fechahoraing, @Usuario)";
                    cmd.CommandType = CommandType.Text;
                    cmd.Connection = con;
                    SqlParameter Op_Id = new SqlParameter("@Op_Id", SqlDbType.Int);
                    Op_Id.Value = Convert.ToInt32(lblidop.Text.Trim());
                    cmd.Parameters.Add(Op_Id);
                    SqlParameter NroCaso = new SqlParameter("@NroCaso", SqlDbType.NChar, 20);
                    NroCaso.Value = "";
                    cmd.Parameters.Add(NroCaso);
                    SqlParameter NroOperativo = new SqlParameter("@NroOperativo", SqlDbType.NChar, 20);
                    NroOperativo.Value = txtnroop.Text.Trim().ToUpper();
                    cmd.Parameters.Add(NroOperativo);
                    SqlParameter Op_FechaOperativo = new SqlParameter("@Op_FechaOperativo", SqlDbType.DateTime);
                    Op_FechaOperativo.Value = txtfechaoperativo.Text.Trim();
                    cmd.Parameters.Add(Op_FechaOperativo);
                    if (txtnombrecaso.Text.Trim() == "")
                    {
                        SqlParameter NombreCaso = new SqlParameter("@NombreCaso", SqlDbType.NChar, 30);
                        NombreCaso.Value = "*";
                        cmd.Parameters.Add(NombreCaso);
                    }
                    else
                    {
                        SqlParameter NombreCaso = new SqlParameter("@NombreCaso", SqlDbType.NChar, 30);
                        NombreCaso.Value = txtnombrecaso.Text.Trim().ToUpper();
                        cmd.Parameters.Add(NombreCaso);
                    }
                    SqlParameter Op_Descripcion = new SqlParameter("@Op_Descripcion", SqlDbType.Text);
                    Op_Descripcion.Value = txtbrevedetalle.Text.Trim();
                    cmd.Parameters.Add(Op_Descripcion);
                    SqlParameter Imagen = new SqlParameter("@Imagen", SqlDbType.NVarChar, 50);
                    Imagen.Value = txtlogo.Text.Trim().ToUpper();
                    cmd.Parameters.Add(Imagen);
                    SqlParameter Descrip_Logo = new SqlParameter("@Descrip_Logo", SqlDbType.Text);
                    Descrip_Logo.Value = txtdescriplogo.Text.Trim().ToUpper();
                    cmd.Parameters.Add(Descrip_Logo);
                    SqlParameter Td_Id = new SqlParameter("@Td_Id", SqlDbType.Int);
                    Td_Id.Value = Convert.ToInt32(lbltipodroga.Text.Trim());
                    cmd.Parameters.Add(Td_Id);
                    SqlParameter PaO_Id = new SqlParameter("@PaO_Id", SqlDbType.Int);
                    PaO_Id.Value = Convert.ToInt32(lblpaisorig.Text.Trim());
                    cmd.Parameters.Add(PaO_Id);
                    SqlParameter PaD_Id = new SqlParameter("@PaD_Id", SqlDbType.Int);
                    PaD_Id.Value = Convert.ToInt32(lblpaisdest.Text.Trim());
                    cmd.Parameters.Add(PaD_Id);
                    SqlParameter Organizacion = new SqlParameter("@Organizacion", SqlDbType.NVarChar, 50);
                    Organizacion.Value = txtorgcrim.Text.Trim().ToUpper();
                    cmd.Parameters.Add(Organizacion);
                    SqlParameter Blanco = new SqlParameter("@Blanco", SqlDbType.Text);
                    Blanco.Value = txtblanco.Text.Trim().ToUpper();
                    cmd.Parameters.Add(Blanco);
                    SqlParameter Observacion = new SqlParameter("@Observacion", SqlDbType.Text);
                    Observacion.Value = txtobservacion.Text.Trim();
                    cmd.Parameters.Add(Observacion);
                    SqlParameter Enlace = new SqlParameter("@Enlace", SqlDbType.NVarChar, 300);
                    Enlace.Value = "";
                    cmd.Parameters.Add(Enlace);
                    SqlParameter Fotografia = new SqlParameter("@Fotografia", SqlDbType.Image, image.Length);
                    Fotografia.Value = image;
                    cmd.Parameters.Add(Fotografia);
                    SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
                    fechahoraing.Value = ahora;
                    cmd.Parameters.Add(fechahoraing);
                    SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NVarChar, 15);
                    Usuario.Value = usuariolog.Trim();
                    cmd.Parameters.Add(Usuario);
                    con.Open();
                    int result = cmd.ExecuteNonQuery();
                    con.Close();
                    muestraLogos();
                    limpialogos();
                }
            }
        }
    }
    private void limpialogos()
    {
        txtlogo.Text = "";
        txtdescriplogo.Text = "";
        lbltipodroga.Text = "";
        lblpaisorig.Text = "";
        lblpaisdest.Text = "";
        txtorgcrim.Text = "";
        txtblanco.Text = "";
        txtobservacion.Text = "";
        txtlogo.Enabled = false;
        txtdescriplogo.Enabled = false;
        txtorgcrim.Enabled = false;
        txtblanco.Enabled = false;
        txtobservacion.Enabled = false;
        fuimagen.Enabled = false;
        btnlogo.Enabled = false;
        cbotipodrogas.Focus();
    }
    private void muestraLogos()
    {
        String CadenaConsulta2 = "SELECT LOGOTIPOS.Logo_Id AS Log1, LOGOTIPOS.Imagen AS Log2, LOGOTIPOS.Descrip_Logo AS Log3, TIPOSDROGA.Descripcion AS Log4, PAIS.Descripcion AS Log5, PAISDEST.Descripcion AS Log6, LOGOTIPOS.Organizacion AS Log7, LOGOTIPOS.Blanco AS Log8, LOGOTIPOS.Observacion AS Log9 " +
                                 "FROM LOGOTIPOS INNER JOIN TIPOSDROGA ON LOGOTIPOS.Td_Id = TIPOSDROGA.Td_Id INNER JOIN PAIS ON LOGOTIPOS.PaO_Id = PAIS.Pa_Id INNER JOIN PAISDEST ON LOGOTIPOS.PaD_Id = PAISDEST.Pa_Id " +
                                 "WHERE (LOGOTIPOS.Op_Id = " + Convert.ToInt32(lblidop.Text.Trim()) + " )";
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter(CadenaConsulta2, con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridLogo.DataSource = ds;
        GridLogo.DataBind();
        con.Close();
    }
    protected void GridView1_SelectedIndexChanged(object sender, EventArgs e)
    {
        GridViewRow row = GridView1.SelectedRow;
        string tipodroga = row.Cells[0].Text;
        muestradatosDroga(tipodroga.Trim());
        txtlogo.Enabled = true;
        txtdescriplogo.Enabled = true;
        txtorgcrim.Enabled = true;
        txtblanco.Enabled = true;
        txtobservacion.Enabled = true;
        fuimagen.Enabled = true;
        btnlogo.Enabled = true;
        txtlogo.Focus();
    }
    private void muestradatosDroga(string datos)
    {
        string strSQLverif = "SELECT TIPOSDROGA.Td_Id, DROGAS.Pa_Id, DROGAS.D_Pa_Id FROM DROGAS INNER JOIN ESTADODROGA ON DROGAS.EstDg_Id = ESTADODROGA.EstDg_Id INNER JOIN TIPOSDROGA ON ESTADODROGA.Td_Id = TIPOSDROGA.Td_Id " +
                             "WHERE (DROGAS.Dg_Id = " + Convert.ToInt32(datos.Trim()) + ")";
        DataTable dtlista = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        SqlCommand cmdrev = new SqlCommand(strSQLverif);
        cmdrev.CommandType = CommandType.Text;
        cmdrev.Connection = SqlConn;
        SqlDataAdapter sdrev = new SqlDataAdapter(cmdrev);
        sdrev.Fill(dtlista);
        for (int i = 0; i < dtlista.Rows.Count; i++)
        {
            lbltipodroga.Text = dtlista.Rows[i][0].ToString();
            lblpaisorig.Text = dtlista.Rows[i][1].ToString();
            lblpaisdest.Text = dtlista.Rows[i][2].ToString();            
        }
        SqlConn.Close();        
    }
    protected void GridLogo_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        string id = GridLogo.Rows[e.RowIndex].Cells[0].Text;
        deletelogo(id);
        muestraLogos();
    }
    private void deletelogo(string codigoidlog)
    {
        string sql = "Delete LOGOTIPOS Where Logo_Id =" + codigoidlog.ToString().Trim();
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXSIII);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
    }
    protected void btngaleria_Click(object sender, EventArgs e)
    {
        Page.Validate("galeria");
        if (Page.IsValid)
        {
            int alto, ancho;
            if (ddlgaleriatam.SelectedValue == "1")
            {
                alto = 591;
                ancho = 394;
            }
            else
            {
                alto = 394;
                ancho = 591;
            }
            if (fupgaleria.PostedFile != null && fupgaleria.PostedFile.FileName != "")
            {
                string strExtension = System.IO.Path.GetExtension(fupgaleria.FileName);
                if ((strExtension.ToUpper() == ".JPG") | (strExtension.ToUpper() == ".JPEG"))
                {
                    System.Drawing.Image imageToBeResized = System.Drawing.Image.FromStream(fupgaleria.PostedFile.InputStream);
                    int imageHeight = imageToBeResized.Height;
                    int imageWidth = imageToBeResized.Width;
                    int maxHeight = alto;
                    int maxWidth = ancho;
                    imageHeight = (imageHeight * maxWidth) / imageWidth;
                    imageWidth = maxWidth;
                    if (imageHeight > maxHeight)
                    {
                        imageWidth = (imageWidth * maxHeight) / imageHeight;
                        imageHeight = maxHeight;
                    }
                    Bitmap bitmap = new Bitmap(imageToBeResized, imageWidth, imageHeight);
                    System.IO.MemoryStream stream = new MemoryStream();
                    bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Jpeg);
                    stream.Position = 0;
                    byte[] image = new byte[stream.Length + 1];
                    stream.Read(image, 0, image.Length);

                    SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandText = "INSERT INTO GALERIA (Op_Id, Descripcion, Foto) VALUES (@Op_Id, @Descripcion, @Foto)";
                    cmd.CommandType = CommandType.Text;
                    cmd.Connection = con;
                    SqlParameter Op_Id = new SqlParameter("@Op_Id", SqlDbType.Int);
                    Op_Id.Value = Convert.ToInt32(lblidop.Text.Trim());
                    cmd.Parameters.Add(Op_Id);
                    SqlParameter Descripcion = new SqlParameter("@Descripcion", SqlDbType.NVarChar, 100);
                    Descripcion.Value = txtdescfoto.Text.Trim().ToUpper();
                    cmd.Parameters.Add(Descripcion);
                    SqlParameter Foto = new SqlParameter("@Foto", SqlDbType.Image, image.Length);
                    Foto.Value = image;
                    cmd.Parameters.Add(Foto);
                    con.Open();
                    int result = cmd.ExecuteNonQuery();
                    con.Close();
                    muestragaleria();
                    limpiagaleria();
                }
            }
        }
    }
    private void muestragaleria()
    {
        String CadenaConsulta2 = "SELECT  Gal_Id AS gal1, Descripcion AS gal2, Foto AS gal3 FROM GALERIA " +
                                 "WHERE (Op_Id = " + Convert.ToInt32(lblidop.Text.Trim()) + " )";
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter(CadenaConsulta2, con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        Gridgaleria.DataSource = ds;
        Gridgaleria.DataBind();
        con.Close();
    }
    private void limpiagaleria()
    {
        txtdescfoto.Text = "";
        fupgaleria.Attributes.Clear();
        fupgaleria.Dispose();        
        txtdescfoto.Focus();
    }
    protected void Gridgaleria_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        string id = Gridgaleria.Rows[e.RowIndex].Cells[0].Text;
        deletegaleria(id);
        muestragaleria();
        txtdescfoto.Focus();
    }
    private void deletegaleria(string codigoidlog)
    {
        string sql = "Delete GALERIA Where Gal_Id =" + codigoidlog.ToString().Trim();
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXSIII);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
    }

    protected void btnsalir_Click(object sender, EventArgs e)
    {
        Response.Redirect("~/Forms/FRM-OP-ING.aspx");
    }
}